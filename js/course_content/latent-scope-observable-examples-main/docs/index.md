---
toc: false
---


# Latent Scope
Latent Scope is an open source tool that leverages the latest in LLMs to embed, visualize, cluster and categorize your data.  

It's really two tools, a <b>pipeline tool</b> to systematically process your datasets and an <b>exploration interface</b> to visualize and edit your categorized data.
Latent Scope can be run fully locally using only open-source models or it can leverage several popular model providers.


<img src="/assets/ui.png" alt="The UI" class="pageshot">


The pipeline is made up of several powerful pieces put together that work on unstructured text input:

<img src="/assets/process-crop.png" alt="The End" class="screenshot">

<div class="process-cards">
<div class="card process-card">

## 1. Ingest
### Ingest your data, either from a CSV, Parquet file or a Pandas DataFrame

</div>
<div class="card process-card">

## 2. Embed
### Run each piece of text through an embedding model, locally or via 3rd party API

</div>
<div class="card process-card">

## 3. Project 
### Turn the embedding vectors into x,y coordinates with UMAP

</div>
<div class="card process-card">

## 4. Cluster
### Organize dense groups of points into distinct clusters with HDBSCAN

</div>
<div class="card process-card">

## 5. Label
### Ask an LLM to create a label for each cluster by summarizing a list of text taken from each cluster (local or 3rd party API)

</div>
<div class="card process-card">

## 6. Save
### Save your scope, preparing it for exploration or export for use in other tools.

</div>
</div>
<br/>

Once you've put your data through this process you will be ready to explore and curate it in the exploration interface.

## Getting started
Follow the guides to get started:
1. [Install and Configure](install-and-config)
2. [Your First Scope](your-first-scope)
3. [Explore and Curate](explore-and-curate)
4. [Exporting Data](export-data)

## Example Analysis
What can you do with Latent Scope? The following examples demonstrate the kinds of perspective and insights you can gain from your unstructured text data.
* Explore free-responses from surveys in this [datavis survey analysis](datavis-survey)
* Cluster thousands of [GitHub issues and PRs](plot-issues)
* Analyze the popularity and content of [10,000 tweets](enjalot-tweets)
* Sort through two hundred years and 50,000 [US Federal laws](us-federal-laws)

## Inputs and Outputs
To use Latent Scope you will need some data to input. This can be in the form of a CSV file, parquet file or a Pandas DataFrame. 
Currently, the focus of Latent Scope is unstructured text data, so you will need to choose a column that will be put through the process.



The process will then go through a series of steps that result in a **scope**, a data format that captures the output of the process in a handy parquet file with a JSON metadata file.

## Design Principles

This tool is meant to be a part of a broader data workflow, a lens that helps you see things in your data that you wouldn't otherwise have. That means it needs to be easy to get data in, and easily get useful data out.

1. Flat files
All of the data that drives the app is stored in flat files. This is so that both final and intermediate outputs can easily be exported for other uses. It also makes it easy to see the status of any part of the process.

2. Remember everything
This tool is intended to aid in research, the purpose is experimentation and exploration. I developed it because far too often I try a lot of things and then I forget what parameters lead me down a promising path in the first place. All choices you make in the process are recorded in metadata files along with the output of the process.

3. It's all about the indices
We consider an input dataset the source of truth, a list of rows that can be indexed into. So all downstream operations, whether its embeddings, pointing to nearest neighbors or assigning data points to clusters, all use indices into the input dataset.