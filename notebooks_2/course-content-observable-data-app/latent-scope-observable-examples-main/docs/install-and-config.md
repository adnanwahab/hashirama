---
Install & Configure
---


# Install and Configure
To process your own data you'll need to install the python module and run it. 
It's recommended to create a folder where the library can store it's data.
This is also a convenient place to make a virtual environment.

```bash
# make a directory for your data to live
mkdir ~/latent-scope-data
cd ~/latent-scope-data

# create & activate virtual environment
python3 -m venv lsenv
source lsenv/bin/activate

# install the module
pip install latentscope
# run the module, specifying the data directory and optionally a port to run on
ls-serve ~/latent-scope-data --port 5001
```
This will start a local webserver from which you can access the tool at [http://localhost:5001](http://localhost:5001)

The next time you want to run Latent Scope you can simply do:
```bash
cd ~/latent-scope-data
ls-serve
```

## Configure
There are a few settings Latent Scope uses to run, they are stored in a `.env` file where you run `ls-serve` so if you followed the above example you could look in   
`~/latent-scope-data/.env`   

You can also see the settings in the web UI at http://localhost:5001/settings

## Third Party API keys
You may want to use third party APIs like OpenAI to run parts of the latent scope process. 
You can do so by setting the API keys in http://localhost:5001/settings

<img src="/assets/install/settings-api-keys.png" alt="Settings API Keys" style="height: 200px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); margin-top: 5px;">



or by manually adding them to `.env`:
```bash
OPENAI_API_KEY=XXX
TOGETHER_API_KEY=XXX
MISTRAL_API_KEY=XXX
VOYAGE_API_KEY=XXX
COHERE_API_KEY=XXX
```