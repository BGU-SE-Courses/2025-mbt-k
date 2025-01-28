// @provengo summon ctrl

/**
 * List of events "of interest" that we want test suites to cover.
 */
const domain = [
    Event('setup_end'),
    Event('ProductAddedToWishlist'),
    Event('product_deleted'),
    Event('AdminLoggedIn'),
    Event('AdminProductsPage'),
    Event('ProductAdded'),
    Event('UserLoggedIn'),
    Event('ProductSearched'),
    Event('ProductAddedToWishlist'),  
];

/**
 * Creates two-way relationships for domain events
 */
const twoWayGoals =[
        // Event relationships within user flow
        { event1: Event('setup_end'), event2: Event('Start(userLogin)'), relation: 'enables' },
        { event1: Event('End(userLogin)'), event2: Event('Start(userSearchProduct)'), relation: 'enables' },
        { event1: Event('End(userSearchProduct)'), event2: Event('Start(userAddProductToWishlist)'), relation: 'enables' },
        { event1: Event('aboutToDeleteProduct'), event2: Event('Start(userAddProductToWishlist)'), relation: 'blocks' },

        // Event relationships within admin flow
        { event1: Event('setup_end'), event2: Event('Start(adminLogin)'), relation: 'enables' },
        { event1: Event('End(adminLogin)'), event2: Event('Start(adminAddProduct)'), relation: 'enables' },
        { event1: Event('End(adminAddProduct)'), event2: Event('Start(adminDeleteProduct)'), relation: 'enables' },

        // Cross-flow relationships (User-Admin interactions)
        { event1: Event('End(userSearchProduct)'), event2: Event('Start(adminLogin)'), relation: 'enables' },
        { event1: Event('aboutToDeleteProduct'), event2: Event('Start(adminDeleteProduct)'), relation: 'blocks' },
    ];

/**
 * Creates goals for two-way testing coverage
 */
const makeGoals = function () {
    return [
        // User flow pairs
        [any(/Start\(userLogin\)/), any(/End\(userLogin\)/)],
        [any(/End\(userLogin\)/), any(/Start\(userSearchProduct\)/)],
        [any(/Start\(userSearchProduct\)/), any(/End\(userSearchProduct\)/)],
        [any(/End\(userSearchProduct\)/), any(/Start\(userAddProductToWishlist\)/)],
        [any(/Start\(userAddProductToWishlist\)/), any(/End\(userAddProductToWishlist\)/)],

        // Admin flow pairs
        [any(/Start\(adminLogin\)/), any(/End\(adminLogin\)/)],
        [any(/End\(adminLogin\)/), any(/Start\(adminAddProduct\)/)],
        [any(/Start\(adminAddProduct\)/), any(/End\(adminAddProduct\)/)],
        [any(/End\(adminAddProduct\)/), any(/Start\(adminDeleteProduct\)/)],
        [any(/Start\(adminDeleteProduct\)/), any(/End\(adminDeleteProduct\)/)],

        // Cross-flow pairs (User-Admin interactions)
        [any(/End\(userSearchProduct\)/), any(/Start\(adminLogin\)/)],
        [any(/aboutToDeleteProduct/), any(/Start\(userAddProductToWishlist\)/)],
        [any(/aboutToDeleteProduct/), any(/Start\(adminDeleteProduct\)/)]
    ];
};

/**
 * two way functions
 */

/**
 * Ranks test suites by how many events from the GOALS array were met.
 * The more goals are met, the higher the score.
 * It makes no difference if a goal was met more than once.
 *
 * @param {Event[][]} ensemble The test suite to be ranked.
 * @returns Number of events from GOALS that have been met.
 */
function rankByMetGoals(ensemble) {
    const unreachedGoals = [];
    for ( let idx=0; idx< twoWayGoals.length; idx++ ) {
                unreachedGoals.push(twoWayGoals[idx]);
            }

    // Loop through the test suite (ensemble)
    for (let testIdx = 0; testIdx < ensemble.length; testIdx++) {
        let test = ensemble[testIdx];

        // Check for every unreached goal
        for (let goalIdx = unreachedGoals.length - 1; goalIdx >= 0; goalIdx--) {
            const unreachedGoal = unreachedGoals[goalIdx];
            let event1Found = false;
            let event2Found = false;

            // Traverse the events in the current test
            for (let eventIdx = 0; eventIdx < test.length; eventIdx++) {
                const event = test[eventIdx];

                // Check if the event matches `event1` or `event2` of the goal
                if (event.equals(unreachedGoal.event1)) {
                    event1Found = true;
                }
                if (event.equals(unreachedGoal.event2) && event1Found) {
                    event2Found = true;
                    break; // If both are satisfied, stop searching
                }
            }

            // If the goal is met (event1 before event2), remove it from unreachedGoals
            if (event1Found && event2Found) {
                unreachedGoals.splice(goalIdx, 1);
            }
        }
    }

    // Return the number of goals met
    return twoWayGoals.length - unreachedGoals.length;
}

//  * @param {Event[][]} ensemble the test suite/ensemble to be ranked
//  * @returns the percentage of goals covered by `ensemble`.
//  */
 function rankingFunction(ensemble) {

    // How many goals did `ensemble` hit?
    const metGoalsCount = rankByMetGoals(ensemble);
    // What percentage of the goals did `ensemble` cover?
    const metGoalsPercent = metGoalsCount/tw.length;
    return metGoalsPercent * 100; // convert to human-readable percentage
 }


// /**
//  * Ranks test suites by how many events from the GOALS array were met.
//  * The more goals are met, the higher the score.
//  *
//  * It make no difference if a goal was met more then once.
//  *
//  * @param {Event[][]} ensemble The test suite to be ranked.
//  * @returns Number of events from GOALS that have been met.
//  */
// function rankByMetGoals( ensemble ) {
//     const unreachedGoals = [];
//     for ( let idx=0; idx< domain.length; idx++ ) {
//         unreachedGoals.push(domain[idx]);
//     }

//     for (let testIdx = 0; testIdx < ensemble.length; testIdx++) {
//         let test = ensemble[testIdx];
//         for (let eventIdx = 0; eventIdx < test.length; eventIdx++) {
//             let event = test[eventIdx];
//             for (let ugIdx=unreachedGoals.length-1; ugIdx >=0; ugIdx--) {
//                 let unreachedGoal = unreachedGoals[ugIdx];
//                 if ( unreachedGoal.contains(event) ) {
//                     unreachedGoals.splice(ugIdx,1);
//                 }
//             }
//         }
//     }

//     return domain.length-unreachedGoals.length;
// }

// /**
//  * Ranks potential test suites based on the percentage of goals they cover.
//  * Goal events are defined in the GOALS array above. An ensemble with rank
//  * 100 covers all the goal events.
//  *
//  * Multiple ranking functions are supported - to change ranking function,
//  * use the `ensemble.ranking-function` configuration key, or the
//  * --ranking-function <functionName> command-line parameter.
//  *
//  * @param {Event[][]} ensemble the test suite/ensemble to be ranked
//  * @returns the percentage of goals covered by `ensemble`.
//  */
//  function rankingFunction(ensemble) {

//     // How many goals did `ensemble` hit?
//     const metGoalsCount = rankByMetGoals(ensemble);
//     // What percentage of the goals did `ensemble` cover?
//     const metGoalsPercent = metGoalsCount/domain.length;
//     return metGoalsPercent * 100; // convert to human-readable percentage
//  }