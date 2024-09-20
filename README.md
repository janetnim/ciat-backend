# ciat-backend
Backend API for image processing model
To run the repo:

- Clone the repository locally and checkout to the cloned folder

- Ensure you have python installed ([Download link](https://www.python.org/downloads/)) and you can confirm via `python --version`

- Install, create and activate a virtualenv for our python packages installations:
```
python -m pip install --user virtualenv
virtualenv ENV
source ENV/bin/activate
```

- Install node packages via `yarn install`

- Then start the app: `node index.js`. On initial server run, python packages will be installed as
shown in the terminal logs and successfully completes with the message `Closing child process after package installation with code 0`

- Ensure the [frontend](https://github.com/janetnim/ciat-frontend/README.md) is running so you are able to interact with the app via the browser
