# Solution Description

## Scope Definition

As I only have 4 calendar days that cannot be fully invested into this assignment, I have to limit the scope somehow. I will focus on the essense of the problem and will skip the UI altogether.

The simplest would be to develop a CLI that takes one argument and writes answers to standard output, except errors should go to STDERR. CLI returns 0 when it was able to succesfully return a response, and will return a positive number in the case of error.

There must be a query parser that translates human-enterd question in plain English into SQL query and into the query against a text document corpus.

### Invocation examples

```bash
hqs "What vulnerabilities does the package express have"
```

Desired output examples:

```bash
hqs "What vulnerabilities does the package express have"
There are no known vulnerabilities in the NPM package express@5.1.0
```

```bash
hqs "What vulnerabilities does the package express@5.0.0-beta.2 have"
Known vulnerabilities of the NPM package express@5.0.0-beta.2 are:
- MEDIUM-1 Cross-site Scripting
- MEDIUM-2 Open Redirect
```

## Technology Stack Choices

### Pros:

- No learning curve for me
- CLI frendly
- can work with relational database, sqlite3 included
- can do http(s) requests
- can work with filesystem
- potentially MongoDB connectors
- rich ecosystem
- not too much of the boilerplate code for abovementioned operations
- testability

### Cons:

- requires Node.js and npm installed
- that adds extra security risks

Considering the nature of the task and these tradeoffs, I would stick to **JavaScript** and **Node.js**.
