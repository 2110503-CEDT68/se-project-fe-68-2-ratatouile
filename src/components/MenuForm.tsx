"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiUrl } from "@/libs/apiUrl";

// นำเข้า Interface ตัวใหม่ที่เราปรับปรุงไป
import { RestaurantItem, MenuItem, DishItem } from "../../interface";

export default function MenuForm({
  onSuccess,
  onClose,
  editData,
}: {
  onSuccess?: () => void;
  onClose?: () => void;
  editData?: RestaurantItem;
}) {
  const { data: session } = useSession();

  // เปลี่ยน State ให้เก็บ Array ของ Menu (ซึ่งข้างในมี items)
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [deleteMenus, setDeleteMenus] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!editData?._id) return;

    const url = apiUrl(`/api/v1/restaurants/${editData._id}/menus`);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setMenus(data.data);
        } else {
          // ถ้ายังไม่มีเมนูเลย ให้สร้างหมวดหมู่เมนูตั้งต้นไว้ 1 อัน
          setMenus([
            {
              _id: crypto.randomUUID(), // ใช้ UUID ชั่วคราวสำหรับ UI
              restaurant: editData._id as any,
              title: "Main Menu",
              items: [],
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch menus");
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, [editData]);

  // ฟังก์ชันอัปเดตชื่อหมวดหมู่เมนู (title)
  const updateMenuTitle = (menuId: string, title: string) => {
    setMenus((prev) =>
      prev.map((m) => (m._id === menuId ? { ...m, title } : m))
    );
  };

  // ฟังก์ชันอัปเดตข้อมูลอาหารแต่ละรายการ
  const updateDish = <K extends keyof DishItem>(
    menuId: string,
    dishId: string,
    field: K,
    value: DishItem[K]
  ) => {
    setMenus((prev) =>
      prev.map((m) => {
        if (m._id !== menuId) return m;
        return {
          ...m,
          items: m.items.map((dish) =>
            dish._id === dishId ? { ...dish, [field]: value } : dish
          ),
        };
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess(false);

  if (!session?.user?.token) {
    setError(`Please sign in before updating restaurant menu.`);
    return;
  }

  setLoading(true);

  try {
    const token = session?.user.token;
    const restaurantId = editData?._id;
    const isMongoId = (str: string) => /^[a-f\d]{24}$/i.test(str);

    // --- STEP 1: ลบเมนูที่ถูกสั่งลบทิ้ง (ที่จดไว้ใน deleteMenus) ---
    if (deleteMenus.length > 0) {
      // ใช้ Promise.all เพื่อส่งคำสั่ง DELETE ไปยัง Backend ทุกอันพร้อมกัน
      await Promise.all(
        deleteMenus.map((menuId) =>
          fetch(apiUrl(`/api/v1/restaurants/${restaurantId}/menus/${menuId}`), {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );
      // เมื่อลบสำเร็จ เคลียร์ state รายการลบ
      setDeleteMenus([]);
    }

    // --- STEP 2: จัดการบันทึก (Create/Update) เมนูที่เหลืออยู่บนหน้าจอ ---
    const url = apiUrl(`/api/v1/restaurants/${restaurantId}/menus/bulk`);

    const payloadMenus = menus.map((m) => {
      const cleanMenu: any = { ...m };
      
      // ถ้า _id ไม่ใช่รูปแบบ MongoDB (แปลว่าเป็น UUID ที่เราสร้างขึ้นชั่วคราว) ให้ลบทิ้ง
      // เพื่อให้ Backend สร้าง _id จริงให้ใหม่
      if (cleanMenu._id && !isMongoId(cleanMenu._id)) {
        delete cleanMenu._id;
      }

      // ทำเช่นเดียวกันกับรายการอาหารภายใน (items)
      cleanMenu.items = m.items.map((dish) => {
        const cleanDish: any = { ...dish };
        if (cleanDish._id && !isMongoId(cleanDish._id)) {
          delete cleanDish._id;
        }
        return cleanDish;
      });

      return cleanMenu;
    });

    const response = await fetch(url, {
      method: "PUT", // ใช้ PUT ตาม API saveMenus ใน Backend
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ menus: payloadMenus }), // ส่งอาเรย์เมนูครอบด้วย key 'menus'
    });

    if (!response.ok) {
      const data = await response.json();
      const errorMessage = Array.isArray(data.error)
        ? data.error.join(", ")
        : data.error || data.message || `Failed to update restaurant menu`;
      throw new Error(errorMessage);
    }

    setSuccess(true);

    // หน่วงเวลาเล็กน้อยเพื่อให้ User เห็นข้อความ Success ก่อนปิด Modal
    setTimeout(() => {
      if (onSuccess) onSuccess();
    }, 1500);

  } catch (err: any) {
    console.error("Submit Error:", err);
    setError(err.message || "An error occurred while saving the menu");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl relative overflow-hidden flex flex-col" // เพิ่ม flex และ flex-col
        style={{
          maxHeight: "90vh", // จำกัดความสูง Modal
          border: "8px solid transparent",
          backgroundImage:
            "linear-gradient(white, white), linear-gradient(135deg, #73683B, #D9C89C)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        {/* Header Section - อยู่กับที่ */}
        <div className="p-8 pb-4">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 text-[#877959] hover:text-[#59200D] transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <h2
            className="text-3xl font-bold text-center text-[#73683B]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Edit Restaurant Menu
          </h2>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar"> 
          {/* แจ้งเตือน Error/Success ให้อยู่ข้างในส่วนที่เลื่อนได้ */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded-lg text-sm">
              Restaurant menu updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {menus.map((menu, mIndex) => (
              <div key={menu._id ?? mIndex} className="p-4 border-2 border-[#D9C89C]/40 rounded-xl bg-gray-50/50">
                {/* ... (ส่วนเนื้อหาเมนูข้างในเหมือนเดิม) */}
                <div className="flex justify-between items-center mb-4">
                  <input
                    value={menu.title}
                    onChange={(e) => updateMenuTitle(menu._id, e.target.value)}
                    className="text-xl font-bold border-b-2 border-[#73683B] bg-transparent focus:outline-none w-1/2 px-2 py-1"
                    placeholder="Menu Title"
                    required
                  />
                  <button
                    type="button"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this entire category?")) {

                          const isMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);

                          if (menu._id && isMongoId(menu._id)) {
                            setDeleteMenus((prev) => [...prev, menu._id]);
                          }
                          setMenus((prev) => prev.filter((m) => m._id !== menu._id));
                        }
                      }}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold underline"
                  >
                    Delete Category
                  </button>
                </div>

                <div className="grid grid-cols-[1fr_1fr_2fr_1fr_60px] gap-4 font-bold border-b border-gray-300 pb-2 text-center text-sm text-gray-600">
                  <div>Name</div>
                  <div>Category</div>
                  <div>Description</div>
                  <div>Price</div>
                  <div></div>
                </div>

                {menu.items.map((dish, i) => (
                  <div key={dish._id ?? i} className="grid grid-cols-[1fr_1fr_2fr_1fr_60px] gap-4 items-center border-b border-gray-200 py-2">
                    <input
                      value={dish.name}
                      required
                      onChange={(e) => updateDish(menu._id, dish._id as string, "name", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                    <input
                      value={dish.category}
                      required
                      onChange={(e) => updateDish(menu._id, dish._id as string, "category", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                    <input
                      value={dish.description}
                      required
                      onChange={(e) => updateDish(menu._id, dish._id as string, "description", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                    <input
                      type="number"
                      value={dish.price}
                      required
                      min={0}
                      onChange={(e) => updateDish(menu._id, dish._id as string, "price", Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-center text-sm"
                    />
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                            setMenus((prev) =>
                              prev.map((m) => {
                                if (m._id !== menu._id) return m;
                                return { ...m, items: m.items.filter((d) => d._id !== dish._id) };
                              })
                            );
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}

                <div
                  onClick={() => {
                    setMenus((prev) =>
                      prev.map((m) => {
                        if (m._id !== menu._id) return m;
                        return {
                          ...m,
                          items: [...m.items, { _id: crypto.randomUUID(), category: "", name: "", price: 0, description: "" }],
                        };
                      })
                    );
                  }}
                  className="cursor-pointer text-center hover:bg-gray-100/50 text-xl w-full py-1.5 font-thin rounded-lg border-[#D9C89C] border-2 text-[#D9C89C] transition mt-3 bg-white"
                >
                  + Add Dish
                </div>
              </div>
            ))}

            {/* Pagination / Loading / Add Category */}
            <div className="space-y-4">
              {pageLoading ? (
                <div className="flex items-center justify-center w-full py-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                  <div className="w-6 h-6 border-2 border-[#877959] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setMenus((prev) => [
                      ...prev,
                      { _id: crypto.randomUUID(), restaurant: (editData?._id || "") as any, title: "", items: [], createdAt: new Date().toISOString() },
                    ]);
                  }}
                  className="cursor-pointer text-center hover:bg-gray-50 text-lg w-full py-2 font-semibold rounded-lg border-dashed border-2 border-[#877959] text-[#877959] transition"
                >
                  + Add New Menu Category
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer py-3 rounded-lg bg-gradient-to-r from-[#D9C89C] to-[#877959] text-white font-semibold hover:opacity-90 transition disabled:opacity-50 sticky bottom-0"
              >
                {loading ? "Updating..." : "Save Restaurant Menu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}