# Testing OpenCart using Cucumber

This directory contains the cucumber files for testing the case: user adds product to wishlist and admin deletes the product from the store. of the OpenCart application.

## Running the tests
Run ```mvn test``` to run all the tests.

## Feature files
The behaviors that we tested are in the feature files that inside the [resources/hellocucumber](resources/hellocucumber) directory. See the files for a detailed description of the tests.

The feature files include:
- `wishlist.feature`: Tests user interactions with the wishlist functionality
- `delete.feature`: Tests admin product deletion functionality

Each feature file contains clear, descriptive scenarios that outline:
- The preconditions (Given)
- The actions being tested (When)
- The expected outcomes (Then)

## Step files
The step files in the [src/test/java/hellocucumber](src/test/java/hellocucumber) directory contain the code that defines how each sentence in the feature files is translated to Selenium actions. See the files for a detailed description of the implementation.

Key files include:
- `StepDefinitions.java`: Contains well-documented step definitions with clear variable names and proper error handling
- `helper.java`: Contains reusable helper methods for browser automation
- `manual/*.java`: Contains manual test implementations for individual features

Each step definition is documented with JavaDoc comments explaining:
- The purpose of the step
- The parameters it accepts
- Any preconditions or dependencies
- The expected behavior