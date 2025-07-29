# API Reference

Below is a complete list of backend API endpoints for this project, including sample input and expected output for each.  
All endpoints (except `/auth/signup` and `/auth/login`) require authentication via Bearer token.

---

## 1. Auth APIs

### POST `/api/auth/signup`
**Register a new user**

**Sample Input:**
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "password123"
}
```
**Sample Output:**
```json
{
  "_id": "USER_ID",
  "name": "Alice",
  "email": "alice@example.com",
  "createdAt": "2024-07-29T12:00:00.000Z",
  "token": "JWT_TOKEN"
}
```

---

### POST `/api/auth/login`
**Login with email and password**

**Sample Input:**
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```
**Sample Output:**
```json
{
  "_id": "USER_ID",
  "name": "Alice",
  "email": "alice@example.com",
  "token": "JWT_TOKEN"
}
```

---

### GET `/api/auth/me`
**Get current user info**

**Headers:**  
`Authorization: Bearer JWT_TOKEN`

**Sample Output:**
```json
{
  "_id": "USER_ID",
  "name": "Alice",
  "email": "alice@example.com"
}
```

---

## 2. Session APIs

### POST `/api/session/`
**Create a new session**

**Headers:**  
`Authorization: Bearer JWT_TOKEN`

**Sample Input:**
```json
{
  "title": "Landing Page"
}
```
**Sample Output:**
```json
{
  "_id": "SESSION_ID",
  "user": "USER_ID",
  "title": "Landing Page",
  "chatHistory": [],
  "uiState": {},
  "createdAt": "2024-07-29T12:00:00.000Z",
  "updatedAt": "2024-07-29T12:00:00.000Z"
}
```

---

### GET `/api/session/`
**Get all sessions for the logged-in user**

**Headers:**  
`Authorization: Bearer JWT_TOKEN`

**Sample Output:**
```json
[
  {
    "_id": "SESSION_ID",
    "user": "USER_ID",
    "title": "Landing Page",
    "chatHistory": [],
    "uiState": {},
    "createdAt": "2024-07-29T12:00:00.000Z",
    "updatedAt": "2024-07-29T12:00:00.000Z"
  }
  // ...more sessions
]
```

---

### GET `/api/session/:id`
**Get a specific session by ID**

**Headers:**  
`Authorization: Bearer JWT_TOKEN`

**Sample Output:**
```json
{
  "_id": "SESSION_ID",
  "user": "USER_ID",
  "title": "Landing Page",
  "chatHistory": [
    {
      "userPrompt": "Create a button",
      "aiResponse": "Here's a button component...",
      "code": {
        "jsx": "<button>Click me</button>",
        "css": ".btn { color: red; }"
      }
    }
  ],
  "uiState": {},
  "createdAt": "2024-07-29T12:00:00.000Z",
  "updatedAt": "2024-07-29T12:00:00.000Z"
}
```

---

### PUT `/api/session/:id`
**Update a session (title, chatHistory, uiState, etc.)**

**Headers:**  
`Authorization: Bearer JWT_TOKEN`

**Sample Input:**
```json
{
  "title": "Updated Title",
  "uiState": { "tab": "jsx" }
}
```
**Sample Output:**
```json
{
  "_id": "SESSION_ID",
  "user": "USER_ID",
  "title": "Updated Title",
  "chatHistory": [ /* ... */ ],
  "uiState": { "tab": "jsx" },
  "createdAt": "2024-07-29T12:00:00.000Z",
  "updatedAt": "2024-07-29T12:10:00.000Z"
}
```

---

### DELETE `/api/session/:id`
**Delete a session**

**Headers:**  
`Authorization: Bearer JWT_TOKEN`

**Sample Output:**
```json
{ "message": "Session deleted" }
```

---

## 3. AI APIs

### POST `/api/ai/generate`
**Generate a new component from a prompt**

**Headers:**  
`Authorization: Bearer JWT_TOKEN`

**Sample Input:**
```json
{
  "prompt": "Create a blue login form",
  "sessionId": "SESSION_ID"
}
```
**Sample Output:**
```json
{
  "jsx": "<form>...</form>",
  "css": ".form { background: blue; }",
  "chatReply": "Here's a blue login form component."
}
```

---

### POST `/api/ai/update`
**Refine/update an existing component with a new prompt**

**Headers:**  
`Authorization: Bearer JWT_TOKEN`

**Sample Input:**
```json
{
  "prompt": "Make the button larger and red",
  "jsx": "<button>Click me</button>",
  "css": ".btn { color: blue; }",
  "sessionId": "SESSION_ID"
}
```
**Sample Output:**
```json
{
  "jsx": "<button style={{ fontSize: '2rem', color: 'red' }}>Click me</button>",
  "css": ".btn { color: red; font-size: 2rem; }",
  "chatReply": "The button is now larger and red."
}
```

---

## 4. Export API

### GET `/api/export/:id`
**Export a session’s code (JSX/CSS) by session ID**

**Headers:**  
`Authorization: Bearer JWT_TOKEN`

**Sample Output:**
```json
{
  "jsx": "<form>...</form>",
  "css": ".form { ... }"
}
```
*(If implemented as a file download, the response may be a `.zip` file instead.)*

---

## Notes

- All endpoints except `/auth/signup` and `/auth/login` require the `Authorization: Bearer <token>` header.
- Error responses are typically:
  ```json
  { "message": "Error description" }
  ```
- For session and AI endpoints, always include the correct `sessionId` to associate actions with the right session.

---