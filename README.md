# Task Processor

This project implements a fault-tolerant, event-driven backend system using AWS services. Tasks are submitted via an HTTP API and processed asynchronously using AWS Lambda and SQS, with retry logic and dead-letter queue (DLQ) support.

## 🏛️ Architecture

<p align="center">
  <img src="https://github.com/user-attachments/assets/a86ed6e7-4db5-4e9b-8a37-176a69468a2f" width="500">
</p>

### Implementation Decisions
- Exponential backoff strategy for failed tasks is achieved by changing the Visibility Timout of failed messages, using their current ApproximateReceiveCount value.
- Handling deduplication by Task ID only at the Consumer level. Publisher always recieves a 201, regardless if Task ID is a duplicate.
- Concurrency and duplication issues are solved by a mutex mechanism using DynamoDB.

## 📥 Task Publishing API

### Endpoint

**POST** [https://kz5cyi58hi.execute-api.eu-central-1.amazonaws.com/publish](https://kz5cyi58hi.execute-api.eu-central-1.amazonaws.com/publish)

This endpoint accepts task publishing requests and enqueues them for asynchronous processing.

### Postman Collection 
[https://www.postman.com/yurahuchok/workspace/task-processor/collection/30410900-e3fdb243-7680-4c2f-a4d1-151cb6bceb97?action=share&creator=30410900](https://www.postman.com/yurahuchok/workspace/task-processor/collection/30410900-e3fdb243-7680-4c2f-a4d1-151cb6bceb97?action=share&creator=30410900)

## 📋 Request Body Schema

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

## 🚛 Example Payloads

### Basic Task
```json
{
  "id": "task-001",
  "payload": {}
}
```

### Basic Task with payload
```json
{
  "id": "task-001",
  "payload": {
    "prop-key": "prop-val"
  }
}
```

### Task with Simulation Settings
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

## 🚀 Deployment Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get a Serverless Access Key

Create an account on Serverless Dashboard and get your Access Key.

### 3. Configure Environment

Create a .env file at the root of the project:
```
cp .env.example .env
```

Then, edit .env and paste your Serverless Access Key:
```
SERVERLESS_ACCESS_KEY=your-access-key-here
```

### 4. Deploy the Stack
```
npm run dev:deploy
```
This will deploy your API, SQS queue, DLQ, and all related Lambda functions to AWS (dev stage).

## 💡 References

### Neverthrow
- [supermacro/neverthrow](https://github.com/supermacro/neverthrow)
- [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/)
- [Robin Pokorný - Railway Oriented TypeScript](https://www.youtube.com/watch?v=AqeR-Fn75Sw`)

### DynamoDB single-table design
- [Creating a single-table design with Amazon DynamoDB](https://aws.amazon.com/blogs/compute/creating-a-single-table-design-with-amazon-dynamodb)
- [The What, Why, and When of Single-Table Design with DynamoDB](https://www.alexdebrie.com/posts/dynamodb-single-table/)
