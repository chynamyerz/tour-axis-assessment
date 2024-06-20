# A TourAxis assessment api

# How to run?

With an assumption that the following softwares are already installed in your host, may procceed.

[Git](https://git-scm.com/), [Nodejs](https://nodejs.org) version >= 16.x, [PostgreSQL](https://www.postgresql.org) version 15.x

### Clone this repository and navigate to it.

```sh
git clone https://github.com/chynamyerz/tour-axis-assessment.git . && cd tour-axis-assessment
```

### Install the dependencies.

```sh
npm i
```

### Create a new postgresql database and make sure to add connection url in the `.env` file.

### Create a `.env` file on the root directory and add the following environment variables.

| Variable     | Description                               | Example                                                            |
| ------------ | ----------------------------------------- | ------------------------------------------------------------------ |
| DATABASE_URL | The database connection url               | postgresql://username:password@localhost:5432/dbname?schema=SCHEMA |
| NODE_ENV     | The environment an api is running on      | development or production                                          |
| PORT         | Port on which the api should be listening | 4000                                                               |

### Run the api.

```sh
npm run dev
```

### Run the api tests.

```sh
npm run test
```

# Use the api, as described from the instructions.

### Create user

curl -i -H "Content-Type: application/json" -X POST -d '{"username":"jsmith","first_name" : "John", "last_name" : "Smith"}' http://hostname/api/users

### Update user

curl -i -H "Content-Type: application/json" -X PUT -d '{"first_name" : "John", "last_name" : "Doe"}' http://hostname/api/users/{id}

### List all users

curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://hostname/api/users

### Get User info

curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://hostname/api/users/{id}

### Create Task

curl -i -H "Content-Type: application/json" -X POST -d '{"name":"My task","description" : "Description of task", "date_time" : "2016-05-25 14:25:00"}' http://hostname/api/users/{user_id}/tasks

### Update Task

curl -i -H "Content-Type: application/json" -X PUT -d '{"name":"My updated task"}' http://hostname/api/users/{user_id}/tasks/{task_id}

### Delete Task

curl -i -H "Content-Type: application/json" -X DELETE http://hostname/api/users/{user_id}/tasks/{task_id}

### Get Task Info

curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://hostname/api/users/{user_id}/tasks/{task_id}

### List all tasks for a user

curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://hostname/api/users/{user_id}/tasks
