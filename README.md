# Software Quality Engineering - System Testing
This is a repository for the system-testing assignment of the Software Quality Engineering course at the [Ben-Gurion University](https://in.bgu.ac.il/), Israel.

## Assignment Description
In this assignment, we tested an open-source software called [OpenCart](https://www.opencart.com/index.php?route=common/home).

$$*TODO* Add some general description about the software$$

## Installation
1) set up the opencart website on local host using the video on the following link  [How to Install OpenCart](https://www.youtube.com/watch?v=GftTTFm58d8) 
2) you need to install [Installing the Provengo Tool](https://docs.provengo.tech/ProvengoCli/0.9.5/installation.html) for cucumber  use the files from the project

## What we tested
We tested a opencart website . We want to test these user stories:

User Story 1: A user adds a product to their wish list

Preconditions:

1)The user has an active account on the platform.

2)The user is logged into their account.

3)The product they wish to add is available in the system.

Expected Outcome:

The selected product is successfully added to the user's wish list.

User Story 2: The administrator removes a product from the platform

Preconditions:

1)The administrator is registered as a system admin.

2)The admin is logged into their admin account.

3)The product intended for removal is currently listed in the system.

Expected Outcome:

The selected product is successfully removed from the system.
## How we tested
We used two different testing methods:
1. [Cucumber](https://cucumber.io/), a behavior-driven testing framework.
2. [Provengo](https://provengo.tech/), a story-based testing framework.

Each of the testing methods is elaborated in its own directory. 

## Results
Update all README.md files (except for d-e, see Section 1). Specifically, replace all $$*TODO*…$$ according to the instructions inside the $$.

