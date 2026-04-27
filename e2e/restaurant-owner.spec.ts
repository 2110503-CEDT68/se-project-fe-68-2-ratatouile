import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";

const mockApiURL =
  process.env.PLAYWRIGHT_MOCK_API_URL || "http://127.0.0.1:3999";
const dialogPauseMs = Number(
  process.env.PLAYWRIGHT_DIALOG_PAUSE_MS || process.env.PLAYWRIGHT_SLOW_MO || 0
);

test.describe.configure({ mode: "serial" });

async function resetApi(request: APIRequestContext, scenario: string) {
  await request.post(`${mockApiURL}/__test/reset`, {
    data: { scenario },
  });
}

async function getApiState(request: APIRequestContext) {
  const response = await request.get(`${mockApiURL}/__test/state`);
  expect(response.ok()).toBeTruthy();
  return (await response.json()).data;
}

async function loginAsRestaurantOwner(page: Page) {
  await page.goto("/auth/signin");
  await page.getByLabel("Email").fill("owner@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto("/dashboard");
  await expect(page.getByText("Manage Reservations")).toBeVisible();
}

async function fillRestaurantForm(page: Page, overrides = {}) {
  const data = {
    name: "Fresh Test Bistro",
    address: "123 Test Lane, Bangkok",
    telephone: "0899999999",
    openTime: "10:00",
    closeTime: "22:00",
    picture: "https://example.com/restaurant.jpg",
    ...overrides,
  };

  await page.getByPlaceholder("Enter restaurant name").fill(data.name);
  await page.getByPlaceholder("Enter full address").fill(data.address);
  await page.getByPlaceholder("e.g. 0812345678").fill(data.telephone);
  await page.locator('input[type="time"]').nth(0).fill(data.openTime);
  await page.locator('input[type="time"]').nth(1).fill(data.closeTime);
  await page
    .getByPlaceholder("https://example.com/image.jpg")
    .fill(data.picture);

  return data;
}

async function runAndAcceptDialog(page: Page, action: () => Promise<void>) {
  const dialogPromise = new Promise<{ type: string; message: string }>(
    (resolve) => {
      page.once("dialog", async (dialog) => {
        const dialogDetails = {
          type: dialog.type(),
          message: dialog.message(),
        };
        await page.waitForTimeout(dialogPauseMs);
        await dialog.accept().catch(() => {
          // In headed mode, a human may click OK before Playwright accepts it.
        });
        resolve(dialogDetails);
      });
    }
  );

  await action();
  return dialogPromise;
}

async function confirmRestaurantDeletion(page: Page) {
  const dialogs: Array<{ type: string; message: string }> = [];

  page.on("dialog", async (dialog) => {
    dialogs.push({ type: dialog.type(), message: dialog.message() });
    await page.waitForTimeout(dialogPauseMs);
    await dialog.accept().catch(() => {
      // In headed mode, a human may click OK before Playwright accepts it.
    });
  });

  await page.getByRole("button", { name: "Delete Restaurant" }).click();
  await expect.poll(() => dialogs.length).toBe(2);

  return dialogs;
}

test("REST-01 AC1 records a new restaurant profile when the owner submits valid details", async ({
  page,
  request,
}) => {
  await resetApi(request, "empty-owner");
  await loginAsRestaurantOwner(page);

  await page.getByRole("button", { name: "create restaurant" }).click();
  const restaurant = await fillRestaurantForm(page);
  await page
    .locator("form")
    .getByRole("button", { name: "Create Restaurant" })
    .click();

  await expect(
    page.getByText("Restaurant created successfully!")
  ).toBeVisible();
  await expect
    .poll(async () => (await getApiState(request)).restaurants)
    .toEqual([
      expect.objectContaining({
        name: restaurant.name,
        address: restaurant.address,
        telephone: restaurant.telephone,
        openTime: restaurant.openTime,
        closeTime: restaurant.closeTime,
      }),
    ]);
});

test("REST-01 AC2 shows validation when mandatory restaurant details are incomplete", async ({
  page,
  request,
}) => {
  await resetApi(request, "empty-owner");
  await loginAsRestaurantOwner(page);

  await page.getByRole("button", { name: "create restaurant" }).click();
  await page
    .locator("form")
    .getByRole("button", { name: "Create Restaurant" })
    .click();

  await expect(page.getByPlaceholder("Enter restaurant name")).toBeFocused();
  expect((await getApiState(request)).restaurants).toEqual([]);
});

test("REST-02 AC1 updates a pending reservation to accepted", async ({
  page,
  request,
}) => {
  await resetApi(request, "owner-with-pending");
  await loginAsRestaurantOwner(page);

  const dialog = await runAndAcceptDialog(page, () =>
    page.getByRole("button", { name: "Accept" }).click()
  );
  expect(dialog.message).toContain("approved");

  await expect
    .poll(async () => (await getApiState(request)).reservations[0].status)
    .toBe("approved");
  await expect(page.getByText("สถานะ:")).toBeVisible();
  await expect(page.getByText("Approved")).toBeVisible();
});

test("REST-02 AC2 displays an error when a cancelled reservation is accepted", async ({
  page,
  request,
}) => {
  await resetApi(request, "accept-cancelled-race");
  await loginAsRestaurantOwner(page);

  const dialog = await runAndAcceptDialog(page, () =>
    page.getByRole("button", { name: "Accept" }).click()
  );
  expect(dialog.message).toContain("Cannot accept a cancelled reservation");

  expect((await getApiState(request)).reservations[0].status).toBe("waiting");
});

test("REST-03 AC1 updates a pending reservation to rejected with a reason", async ({
  page,
  request,
}) => {
  await resetApi(request, "owner-with-pending");
  await loginAsRestaurantOwner(page);

  await page.getByRole("button", { name: "Reject" }).click();
  await page
    .getByPlaceholder("Please provide a reason...")
    .fill("Fully booked at that time");

  const dialog = await runAndAcceptDialog(page, () =>
    page.getByRole("button", { name: "Confirm Rejection" }).click()
  );
  expect(dialog.message).toContain("rejected");

  await expect
    .poll(async () => (await getApiState(request)).reservations[0])
    .toEqual(
      expect.objectContaining({
        status: "rejected",
        reason_reject: "Fully booked at that time",
      })
    );
  await expect(page.getByText("Rejected")).toBeVisible();
});

test("REST-03 AC2 prompts for a mandatory reason before rejecting", async ({
  page,
  request,
}) => {
  await resetApi(request, "owner-with-pending");
  await loginAsRestaurantOwner(page);

  await page.getByRole("button", { name: "Reject" }).click();
  await page.getByRole("button", { name: "Confirm Rejection" }).click();

  await expect(
    page.getByPlaceholder("Please provide a reason...")
  ).toBeFocused();
  expect((await getApiState(request)).reservations[0].status).toBe("waiting");
});

test("REST-04 AC1 records updated restaurant information", async ({
  page,
  request,
}) => {
  await resetApi(request, "owner-with-restaurant");
  await loginAsRestaurantOwner(page);

  await page.getByRole("button", { name: "Edit Profile" }).click();
  const restaurant = await fillRestaurantForm(page, {
    name: "Updated Bistro",
    address: "456 Updated Road, Bangkok",
    openTime: "11:00",
    closeTime: "23:00",
  });
  await page
    .locator("form")
    .getByRole("button", { name: "Update Restaurant" })
    .click();

  await expect(
    page.getByText("Restaurant updated successfully!")
  ).toBeVisible();
  await expect
    .poll(async () => (await getApiState(request)).restaurants[0])
    .toEqual(
      expect.objectContaining({
        name: restaurant.name,
        address: restaurant.address,
        openTime: restaurant.openTime,
        closeTime: restaurant.closeTime,
      })
    );
});

test("REST-04 AC2 prevents saving blank mandatory restaurant fields", async ({
  page,
  request,
}) => {
  await resetApi(request, "owner-with-restaurant");
  await loginAsRestaurantOwner(page);

  await page.getByRole("button", { name: "Edit Profile" }).click();
  await page.getByPlaceholder("Enter restaurant name").clear();
  await page
    .locator("form")
    .getByRole("button", { name: "Update Restaurant" })
    .click();

  await expect(page.getByPlaceholder("Enter restaurant name")).toBeFocused();
  expect((await getApiState(request)).restaurants[0].name).toBe(
    "Original Bistro"
  );
});

test("REST-05 AC1 removes the restaurant after deletion is confirmed", async ({
  page,
  request,
}) => {
  await resetApi(request, "owner-with-restaurant");
  await loginAsRestaurantOwner(page);

  const dialogs = await confirmRestaurantDeletion(page);
  expect(dialogs[0]).toEqual(
    expect.objectContaining({
      type: "confirm",
      message: expect.stringContaining("Are you sure"),
    })
  );
  expect(dialogs[1]).toEqual(
    expect.objectContaining({
      type: "alert",
      message: expect.stringContaining("Restaurant deleted successfully"),
    })
  );

  await expect
    .poll(async () => (await getApiState(request)).restaurants)
    .toEqual([]);
});

test("REST-05 AC2 prevents deletion when active pending reservations exist", async ({
  page,
  request,
}) => {
  await resetApi(request, "owner-with-pending");
  await loginAsRestaurantOwner(page);

  const dialogs = await confirmRestaurantDeletion(page);
  expect(dialogs[0]).toEqual(
    expect.objectContaining({
      type: "confirm",
      message: expect.stringContaining("Are you sure"),
    })
  );
  expect(dialogs[1]).toEqual(
    expect.objectContaining({
      type: "alert",
      message: expect.stringContaining("active pending reservations"),
    })
  );

  expect((await getApiState(request)).restaurants).toHaveLength(1);
});
