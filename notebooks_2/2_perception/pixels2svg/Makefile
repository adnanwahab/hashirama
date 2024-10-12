PROJECT = pixels2svg


isort:
	isort --known-local-folder $(PROJECT) $(PROJECT) tests examples


lint:
	flake8 $(PROJECT) --count --show-source --statistics
	flake8 tests --count --show-source --statistics
	flake8 examples --count --show-source --statistics
	isort --known-local-folder $(PROJECT) --check-only $(PROJECT) tests examples

test:
	PYTHON_VERSION=$$(python3 --version) && \
	if echo "$${PYTHON_VERSION}" | grep -q "3.10"; \
	then python3 -m pytest tests; \
	else nosetests -v --with-coverage --cover-package=$(PROJECT) tests; \
	fi

build_package:
	rm -rf dist && \
	python3 setup.py sdist && \
	python3 -m twine check dist/*

publish_package:
ifndef TWINE_USERNAME
	$(error TWINE_USERNAME is not set)
else
ifndef TWINE_PASSWORD
	$(error TWINE_PASSWORD is not set)
endif
endif
	python3 -m twine upload --verbose -u $(TWINE_USERNAME) -p $(TWINE_PASSWORD) dist/*
