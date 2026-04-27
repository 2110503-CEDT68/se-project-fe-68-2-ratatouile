import http from "node:http";

const port = Number(process.env.PLAYWRIGHT_MOCK_API_PORT || 3999);

const owner = {
  _id: "owner-1",
  id: "owner-1",
  name: "Restaurant Owner",
  email: "owner@example.com",
  role: "restaurantOwner",
  telephone: "0811111111",
  createdAt: "2026-04-27T00:00:00.000Z",
};

const baseRestaurant = {
  _id: "restaurant-1",
  id: "restaurant-1",
  owner: owner._id,
  name: "Original Bistro",
  address: "99 Old Road, Bangkok",
  telephone: "0812345678",
  openTime: "09:00",
  closeTime: "21:00",
  picture: "/img/1.png",
  createdAt: "2026-04-27T00:00:00.000Z",
  menus: [],
};

const pendingReservation = {
  _id: "reservation-1",
  id: "reservation-1",
  reservationDate: "2026-04-27T12:00:00.000Z",
  status: "waiting",
  user: {
    _id: "customer-1",
    name: "Customer One",
    email: "customer@example.com",
    telephone: "0822222222",
    role: "user",
    createdAt: "2026-04-27T00:00:00.000Z",
  },
  restaurant: baseRestaurant,
  createdAt: "2026-04-27T00:00:00.000Z",
};

let state = createState("empty-owner");

function createState(scenario = "empty-owner") {
  const restaurant = structuredClone(baseRestaurant);
  const reservation = {
    ...structuredClone(pendingReservation),
    restaurant,
  };

  switch (scenario) {
    case "owner-with-restaurant":
      return { restaurants: [restaurant], reservations: [], flags: {} };
    case "owner-with-pending":
      return {
        restaurants: [restaurant],
        reservations: [reservation],
        flags: {},
      };
    case "accept-cancelled-race":
      return {
        restaurants: [restaurant],
        reservations: [reservation],
        flags: { failAcceptAsCancelled: true },
      };
    case "empty-owner":
    default:
      return { restaurants: [], reservations: [], flags: {} };
  }
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
  });
}

function hasMandatoryRestaurantFields(body) {
  return ["name", "address", "telephone", "openTime", "closeTime"].every(
    (field) => typeof body[field] === "string" && body[field].trim().length > 0
  );
}

function updateReservationRestaurant(updatedRestaurant) {
  state.reservations = state.reservations.map((reservation) => {
    if (reservation.restaurant._id !== updatedRestaurant._id)
      return reservation;
    return { ...reservation, restaurant: updatedRestaurant };
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && pathname === "/__test/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "POST" && pathname === "/__test/reset") {
    const body = await readJson(req);
    state = createState(body.scenario);
    if (body.state) {
      state = {
        restaurants: body.state.restaurants ?? state.restaurants,
        reservations: body.state.reservations ?? state.reservations,
        flags: body.state.flags ?? state.flags,
      };
    }
    sendJson(res, 200, { success: true, data: state });
    return;
  }

  if (req.method === "GET" && pathname === "/__test/state") {
    sendJson(res, 200, { success: true, data: state });
    return;
  }

  if (req.method === "POST" && pathname === "/api/v1/auth/login") {
    const body = await readJson(req);
    if (body.email && body.password) {
      sendJson(res, 200, {
        success: true,
        token: "owner-token",
        user: owner,
      });
      return;
    }

    sendJson(res, 401, { success: false, error: "Invalid email or password" });
    return;
  }

  if (req.method === "GET" && pathname === "/api/v1/restaurants") {
    sendJson(res, 200, {
      success: true,
      count: state.restaurants.length,
      data: state.restaurants,
    });
    return;
  }

  if (req.method === "POST" && pathname === "/api/v1/restaurants") {
    const body = await readJson(req);
    if (!hasMandatoryRestaurantFields(body)) {
      sendJson(res, 400, {
        success: false,
        error: "Please complete mandatory restaurant details",
      });
      return;
    }

    const restaurant = {
      _id: "restaurant-created",
      id: "restaurant-created",
      owner: owner._id,
      createdAt: "2026-04-27T00:00:00.000Z",
      menus: [],
      ...body,
    };
    state.restaurants.push(restaurant);
    sendJson(res, 201, { success: true, data: restaurant });
    return;
  }

  const restaurantMatch = pathname.match(/^\/api\/v1\/restaurants\/([^/]+)$/);
  if (restaurantMatch && req.method === "PUT") {
    const restaurantId = restaurantMatch[1];
    const body = await readJson(req);
    if (!hasMandatoryRestaurantFields(body)) {
      sendJson(res, 400, {
        success: false,
        error: "Please complete mandatory restaurant details",
      });
      return;
    }

    const index = state.restaurants.findIndex(
      (restaurant) => restaurant._id === restaurantId
    );
    if (index === -1) {
      sendJson(res, 404, { success: false, error: "Restaurant not found" });
      return;
    }

    state.restaurants[index] = {
      ...state.restaurants[index],
      ...body,
    };
    updateReservationRestaurant(state.restaurants[index]);
    sendJson(res, 200, { success: true, data: state.restaurants[index] });
    return;
  }

  if (restaurantMatch && req.method === "DELETE") {
    const restaurantId = restaurantMatch[1];
    const hasActiveReservation = state.reservations.some(
      (reservation) =>
        reservation.restaurant._id === restaurantId &&
        reservation.status === "waiting"
    );

    if (hasActiveReservation) {
      sendJson(res, 400, {
        success: false,
        error: "Cannot delete restaurant with active pending reservations",
      });
      return;
    }

    state.restaurants = state.restaurants.filter(
      (restaurant) => restaurant._id !== restaurantId
    );
    sendJson(res, 200, { success: true, data: {} });
    return;
  }

  if (req.method === "GET" && pathname === "/api/v1/reservations") {
    sendJson(res, 200, {
      success: true,
      count: state.reservations.length,
      data: state.reservations,
    });
    return;
  }

  const reservationMatch = pathname.match(/^\/api\/v1\/reservations\/([^/]+)$/);
  if (reservationMatch && req.method === "PUT") {
    const reservationId = reservationMatch[1];
    const body = await readJson(req);
    const reservation = state.reservations.find(
      (item) => item._id === reservationId
    );

    if (!reservation) {
      sendJson(res, 404, { success: false, message: "Reservation not found" });
      return;
    }

    if (body.status === "approved" && state.flags.failAcceptAsCancelled) {
      sendJson(res, 400, {
        success: false,
        message: "Cannot accept a cancelled reservation",
      });
      return;
    }

    if (
      body.status === "rejected" &&
      !String(body.reason_reject || "").trim()
    ) {
      sendJson(res, 400, {
        success: false,
        message: "Rejection reason is required",
      });
      return;
    }

    reservation.status = body.status;
    if (body.status === "rejected") {
      reservation.reason_reject = body.reason_reject;
    }
    sendJson(res, 200, { success: true, data: reservation });
    return;
  }

  sendJson(res, 404, {
    success: false,
    error: `No mock route for ${req.method} ${pathname}`,
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Mock API server listening on http://127.0.0.1:${port}`);
});
