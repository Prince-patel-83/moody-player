# Auth API Documentation

## Register User

Endpoint: POST /api/auth/register

### Description
This endpoint creates a new user account and registers the user in the system.
If the request is valid, the server creates the user, hashes the password, generates a JWT token, and sets it as an HTTP-only cookie.

### Request Body
The request body must be in JSON format.

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

### Required Data
- name: string
  - Required
  - Minimum 3 characters
- email: string
  - Required
  - Must be a valid email address
- password: string
  - Required
  - Minimum 6 characters

### Success Response
Status: 201 Created

```json
{
  "success": true,
  "message": "User registered successfully.",
  "user": {
    "id": "64f2c9c1d3a1b2c3d4e5f678",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-09-24T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Responses
- 400 Bad Request
  - Missing fields
  - Invalid email format
  - Password too short
  - Validation failed

```json
{
  "message": "Name, email, and password are required."
}
```

or

```json
{
  "errors": [
    {
      "msg": "Name must be at least 3 Characters long",
      "param": "name",
      "location": "body"
    }
  ]
}
```

- 409 Conflict
  - Email already registered

```json
{
  "message": "Email is already registered."
}
```

- 500 Internal Server Error

```json
{
  "message": "Server error.",
  "success": false
}
```

### Cookie Behavior
On successful registration, the backend sends a cookie named `token`:
- httpOnly: true
- sameSite: "strict"
- maxAge: 24 hours

This token is used to authenticate future requests.

---

## Login User

Endpoint: POST /api/auth/login

### Description
This endpoint allows an existing user to log in using their email and password. If the credentials are valid, the server creates a JWT token and sends it back in the response and as an HTTP-only cookie.

### Request Body
The request body must be in JSON format.

```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

### Required Data
- email: string
  - Required
  - Must be a valid email address
- password: string
  - Required
  - Must be at least 6 characters long

### Success Response
Status: 200 OK

```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": "64f2c9c1d3a1b2c3d4e5f678",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-09-24T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Responses
- 400 Bad Request
  - Missing email or password
  - Invalid email format
  - Password validation failed

```json
{
  "message": "Email and password are required."
}
```

- 401 Unauthorized
  - Invalid email or password

```json
{
  "message": "Invalid email or password."
}
```

- 500 Internal Server Error

```json
{
  "message": "Server error.",
  "success": false
}
```

### Cookie Behavior
On successful login, the backend sends a cookie named `token`:
- httpOnly: true
- sameSite: "strict"
- maxAge: 24 hours

This token is used to authenticate future requests.

---

## Logout User

Endpoint: GET /api/auth/logout

### Description
This endpoint logs out the authenticated user by clearing the `token` cookie from the browser.

### Authentication
This route requires a valid token cookie sent with the request.

### Success Response
Status: 200 OK

```json
{
  "message": "Logout successful"
}
```

### Error Responses
- 401 Unauthorized
  - Missing token
  - Invalid or expired token

```json
{
  "message": "Authentication token is required."
}
```

or

```json
{
  "message": "Invalid or expired token."
}
```

### Cookie Behavior
The server removes the `token` cookie from the client.

---

## Get Current User

Endpoint: GET /api/auth/me

### Description
This endpoint returns the currently logged-in user's profile information using the token stored in the cookie.

### Authentication
This route requires a valid token cookie.

### Success Response
Status: 200 OK

```json
{
  "user": {
    "id": "64f2c9c1d3a1b2c3d4e5f678",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-09-24T12:00:00.000Z"
  }
}
```

### Error Responses
- 401 Unauthorized
  - Missing token
  - Invalid or expired token

```json
{
  "message": "Authentication token is required."
}
```

or

```json
{
  "message": "Invalid or expired token."
}
```

- 404 Not Found
  - User no longer exists in the database

```json
{
  "message": "User not found."
}
```

- 500 Internal Server Error

```json
{
  "message": "Server error."
}
```


## Song API

### Upload Song

Endpoint: `POST /api/song/upload`

### Authentication

Requires a valid authentication cookie.

### Request

Content type: `multipart/form-data`

| Field | Type | Required |
|---|---|---|
| title | string | Yes |
| artist | string | Yes |
| mood | string | Yes |
| audio | file | Yes |

### Example

```bash
curl -X POST http://localhost:5000/api/song/upload ^
  -H "Cookie: token=YOUR_TOKEN" ^
  -F "title=Calm Waves" ^
  -F "artist=John Doe" ^
  -F "mood=calm" ^
  -F "audio=@C:\Music\calm-waves.mp3"
```

### Success Response

Status: `201 Created`

```json
{
  "message": "song created sucessfully",
  "songs": {
    "_id": "64f2c9c1d3a1b2c3d4e5f678",
    "title": "Calm Waves",
    "artist": "John Doe",
    "audio": "https://ik.imagekit.io/example/song.mp3",
    "mood": "calm",
    "author": "64f2c9c1d3a1b2c3d4e5f678"
  },
  "success": true
}
```

### Get Songs by Mood

Endpoint: `GET /api/song?mood={mood}`

### Example

```bash
curl "http://localhost:5000/api/song?mood=calm"
```

### Success Response

Status: `200 OK`

```json
{
  "message": "song fetched sucessfully",
  "songs": [
    {
      "_id": "64f2c9c1d3a1b2c3d4e5f678",
      "title": "Calm Waves",
      "artist": "John Doe",
      "audio": "https://ik.imagekit.io/example/song.mp3",
      "mood": "calm",
      "author": "64f2c9c1d3a1b2c3d4e5f678"
    }
  ],
  "success": true
}
```

### Error Responses

#### Missing Mood

Status: `400 Bad Request`

```json
{
  "message": "mood is required",
  "success": false
}
```

#### Songs Not Found

Status: `404 Not Found`

```json
{
  "message": "song not found",
  "success": false
}
```




## Playlist API

All playlist endpoints require a valid authentication cookie.

### Create Playlist

Endpoint: `POST /api/playlists`

#### Request Body

```json
{
  "name": "Relaxing Evening",
  "mood": "relaxed"
}
```

#### Example

```bash
curl -X POST http://localhost:5000/api/playlists ^
  -H "Content-Type: application/json" ^
  -H "Cookie: token=YOUR_TOKEN" ^
  -d "{\"name\":\"Relaxing Evening\",\"mood\":\"relaxed\"}"
```

#### Success Response

Status: `201 Created`

```json
{
  "success": true,
  "message": "Playlist created successfully",
  "playlist": {
    "_id": "64f2c9c1d3a1b2c3d4e5f678",
    "name": "Relaxing Evening",
    "mood": "relaxed",
    "user": "64f2c9c1d3a1b2c3d4e5f678",
    "songs": []
  }
}
```

### Get User Playlists

Endpoint: `GET /api/playlists`

```bash
curl http://localhost:5000/api/playlists ^
  -H "Cookie: token=YOUR_TOKEN"
```

### Get Playlist by ID

Endpoint: `GET /api/playlists/:playlistId`

```bash
curl http://localhost:5000/api/playlists/64f2c9c1d3a1b2c3d4e5f678 ^
  -H "Cookie: token=YOUR_TOKEN"
```

### Update Playlist

Endpoint: `PUT /api/playlists/:playlistId`

```bash
curl -X PUT http://localhost:5000/api/playlists/64f2c9c1d3a1b2c3d4e5f678 ^
  -H "Content-Type: application/json" ^
  -H "Cookie: token=YOUR_TOKEN" ^
  -d "{\"name\":\"Updated Playlist\",\"mood\":\"happy\"}"
```

### Delete Playlist

Endpoint: `DELETE /api/playlists/:playlistId`

```bash
curl -X DELETE http://localhost:5000/api/playlists/64f2c9c1d3a1b2c3d4e5f678 ^
  -H "Cookie: token=YOUR_TOKEN"
```

### Add Song to Playlist

Endpoint: `POST /api/playlists/:playlistId/songs/:songId`

```bash
curl -X POST http://localhost:5000/api/playlists/PLAYLIST_ID/songs/SONG_ID ^
  -H "Cookie: token=YOUR_TOKEN"
```

The song's mood must match the playlist's mood.

### Remove Song from Playlist

Endpoint: `DELETE /api/playlists/:playlistId/songs/:songId`

```bash
curl -X DELETE http://localhost:5000/api/playlists/PLAYLIST_ID/songs/SONG_ID ^
  -H "Cookie: token=YOUR_TOKEN"
```

### Supported Moods

- `happy`
- `sad`
- `romantic`
- `relaxed`
- `energetic`
- `angry`
