# 📦 Task Processor API

This project implements a fault-tolerant, event-driven backend system using AWS services. Tasks are submitted via an HTTP API and processed asynchronously using AWS Lambda and SQS, with retry logic and dead-letter queue (DLQ) support.

## 🚀 Task Publishing API

### 🔗 Endpoint

**POST**  
`https://kz5cyi58hi.execute-api.eu-central-1.amazonaws.com/publish`

This endpoint accepts task publishing requests and enqueues them for asynchronous processing.

### 📪 Postman Collection 
`https://www.postman.com/yurahuchok/workspace/task-processor/collection/30410900-e3fdb243-7680-4c2f-a4d1-151cb6bceb97?action=share&creator=30410900`

## 📥 Request Body Schema

The request body must be a JSON object that defines the `Task` to be processed.

### 🔹 `Task`

| Field     | Type     | Required | Description |
|-----------|----------|----------|-------------|
| `id`      | `string` | ✅ Yes   | A unique, non-empty identifier for the task. |
| `payload` | `object` | ✅ Yes   | Contains task-specific data and optional simulation parameters. |
| `payload.simulation`  | `Simulation` | ❌ No     | Parameters for processing simulation. |

### 🔸 `Simulation`

This section allows simulating how the backend processes the `Task`. If omitted, default behavior is assumed.

| Field           | Type     | Required | Description |
|------------------|----------|----------|-------------|
| `executionTime`  | `number` | ❌ No     | Simulated execution time in milliseconds. Must be between `0` and `1000`. |
| `failureChance`  | `number` | ❌ No     | Probability of failure (between `0` and `1`). Use to simulate random task processing failures. |

## 🧪 Example Payloads

### ✅ Basic Task
```json
{
  "id": "task-001",
  "payload": {}
}
```

### ✅ Basic Task with payload
```json
{
  "id": "task-001",
  "payload": {
    "prop-key": "prop-val"
  }
}
```

### ✅ Task with Simulation Settings
```
{
  "id": "task-002",
  "payload": {
    "simulation": {
      "executionTime": 400,
      "failureChance": 0.3
    }
  }
}
```

