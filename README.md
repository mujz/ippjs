# i++

Go to [ippjs.mujz.ca](https://ipp.mujz.ca). Sign up with email or Facebook. Break it if you can ;)

# Run it yourself

All you need is docker and docker-compose

```Bash
docker-compose up
```

## Model

Our model consists of one table `user`. It has `email`, `password`, `facebook_id`, and `num` fields. We're using Postgresql with SequelizeJS as the ORM.

## RESTful API

All API conform to the [jsonapi](http://jsonapi.org) specifications.

We're using ExpressJS and `jsonapi-serializer` package. We will have 4 main endpoints:

- `GET /next`
  - Increments the user's number in the database and cache
    - return 500 on overflow (There's probably a better error code for this though)
  - Returns the new user's number
- `GET /current`
  - Looks for the user's number in the cache,
    - hit: returns it from cache
    - miss: fetches it from the user's table in the DB and adds it to the cache
  - Returns the user's number
- `PUT /current`
  - Verifies body (for example not integer, overflow, underflow, null, etc.)
    - returns 400 if verification fails
  - Updates the user's number in the DB and the cache
  - Returns the updated number.
- `POST /login`
  - Verifies the email and password
    - returns 401 if it fails
  - Returns the user's API key
- `POST /signup`
  - Validates the email and password
    - If email already used or invalid or password violates the rules, return 400 with the reason in the response body
  - Creates a user with the passed email and password
  - Initializes the user's number at 1
  - Returns the API key

If any of these endpoints is called without an API key or with an invalid API key, a 401 is returned.

For any other endpoint, a 404 is returned.

Database errors or any other internal errors return 500.

## Authentication

We're using the `jsonwebtoken` package to implement jwt oauth2 bearer authentication.

## Incrementing

It's pretty straight forward. The only thing that I want to say about this is that we should have the database do the incrementation and not the Go service. This is to make sure that the increment is done safely and we don't get concurrency issues or race conditions. For example, if the current number is 11:

```SQL
-- Don't do this
UPDATE user SET number = 12 WHERE email='mujtaba@example.com';

-- Instead do this
UPDATE user SET number = number + 1 WHERE email='mujtaba@example.com`;
```

## Frontend

A minimalistic SPA framework would be appropriate here. `riot.js`, being very small in size and having all the features we need, makes it a great choice. The rest can be done with vanilla javascript.

# Specification

## User Story

As a developer I need a way to get integers that automatically increment so that I can generate identifiers from within my code. My code is javascript running as an AWS Lambda function and I don’t want the extra complexity of creating and managing a database or key/value store. I also don’t want the complexity of dealing with other AWS services such as S3. I’m in a hurry and would rather just call a REST endpoint that returns the next available integer so that I can get on with my job. Additionally, my code needs to be stateless, meaning that I can’t store any data between calls. Why I need to generate identifiers using sequential integers is not important ;) Suffice it to say that this challenge is based on a real-world scenario.

## Tasks

Develop a rest service that:

1. Allows me to register as a user. At a minimum, this should be a REST endpoint that accepts an email address and a password and returns an API key.
1. Returns the next integer in my sequence when called. For example, if my current integer is 12, the service should return 13 when it is called. The endpoint should be secured by API key. I should not have to provide the previous value of the integer for this to work. Fetching the next integer should cause my current integer to increment by 1 on the server so that if I call the endpoint again, I get the next integer in the sequence.
1. Allows me to fetch my current integer. For example, if my current integer is 12, the service should return 12. The endpoint should be secured by API key.
1. Allows me to reset my integer to an arbitrary, non-negative value. For example, my integer may be currently 1005. I would like to reset it to 1000. The endpoint should be secured by API key.
1. Allow sign up using OAuth
  - Github, Facebook, Google, anything that supports it!
1. Build a UI for the service, especially the account creation functionality, as a single page app that consumes your API.

Deploy your API somewhere and include the link in your README so we can try it out without having to run it.

## Examples

```bash
$ # Get the next integer in the sequence
$ curl https://myapi.com/v1/next -H “Authorization: Bearer XXXXXX”
$ # Get the current integer
$ curl https://myapi.com/v1/current -H “Authorization: Bearer XXXXX”
$ # Reset the current integer
$ curl -X “PUT” https://myapi.com/v1/current -H “Authorization: Bearer XXXXX” --data “current=1000”
```
