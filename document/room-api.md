# Room API Documentation

The Room API allows developers to manage rooms in the Haxball hosting environment. Below is the detailed documentation for the available endpoints, their parameters, responses, and examples.

## Endpoints

### Create Room

- **Endpoint:** `POST /rooms`
- **Description:** Create a new room.
- **Request Body:**
  ```json
  {
      "name": "string",
      "maxPlayers": "integer",
      "private": "boolean"
  }
  ```
- **Responses:**
  - `201 Created`
  - `400 Bad Request`

### Get Room

- **Endpoint:** `GET /rooms/{roomId}`
- **Description:** Retrieve information about a specific room.
- **Path Parameters:**
  - `roomId`: The ID of the room to retrieve.
- **Responses:**
  - `200 OK`
  - `404 Not Found`

### Update Room

- **Endpoint:** `PUT /rooms/{roomId}`
- **Description:** Update an existing room.
- **Path Parameters:**
  - `roomId`: The ID of the room to update.
- **Request Body:**
  ```json
  {
      "name": "string",
      "maxPlayers": "integer",
      "private": "boolean"
  }
  ```
- **Responses:**
  - `200 OK`
  - `404 Not Found`

### Delete Room

- **Endpoint:** `DELETE /rooms/{roomId}`
- **Description:** Delete a specific room.
- **Path Parameters:**
  - `roomId`: The ID of the room to delete.
- **Responses:**
  - `204 No Content`
  - `404 Not Found`

## Example

### Create Room Example

```bash
curl -X POST https://api.haxball.com/rooms \
     -H 'Content-Type: application/json' \
     -d '{"name": "New Room", "maxPlayers": 10, "private": true}'
```

### Get Room Example

```bash
curl -X GET https://api.haxball.com/rooms/{roomId}
```

## Conclusion

The Room API provides the necessary endpoints to manage rooms effectively within the Haxball hosting platform. Make sure to refer to the official documentation for any updates or changes to the API specifications.
