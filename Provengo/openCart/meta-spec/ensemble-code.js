// @provengo summon ctrl

/**
 * List of events "of interest" that we want test suites to cover.
 */
const domain = [
    Event('setup_end'),
    Event('aboutToDeleteProduct'),
    Event('Start(adminLogin)'),
    Event('End(adminLogin)'),
    Event('Start(adminAddProduct)'),
    Event('End(adminAddProduct)'),
    Event('Start(adminDeleteProduct)'),
    Event('End(adminDeleteProduct)'),
    Event('Start(userLogin)'),
    Event('End(userLogin)'),
    Event('Start(userSearchProduct)'),
    Event('End(userSearchProduct)'),
    Event('Start(userAddProductToWishlist)'),
    Event('End(userAddProductToWishlist)'),
];

/**
 * Creates two-way relationships for domain events
 */
const two_way = function () {
    return [
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
};

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
    const twoWayGoals = two_way(); // Get the two-way relationship goals

    // Initialize the unreached goals with all the two-way relationships
    for (let idx = 0; idx < twoWayGoals.length; idx++) {
        unreachedGoals.push(twoWayGoals[idx]);  // Add all two-way goals to the unreached list
    }

    // Loop through the test suite (ensemble)
    for (let testIdx = 0; testIdx < ensemble.length; testIdx++) {
        let test = ensemble[testIdx];

        // Check each event in the test
        for (let eventIdx = 0; eventIdx < test.length; eventIdx++) {
            let event = test[eventIdx];

            // Loop through the unreached goals and check if any are satisfied by the event
            for (let ugIdx = unreachedGoals.length - 1; ugIdx >= 0; ugIdx--) {
                let unreachedGoal = unreachedGoals[ugIdx];

                // Check if the event satisfies the unreached goal
                if (unreachedGoal.event1 === event || unreachedGoal.event2 === event) {
                    // If the event satisfies the goal, remove the goal from the list
                    unreachedGoals.splice(ugIdx, 1);
                }
            }
        }
    }

    // Return the number of goals that were met (i.e., the number of goals not in unreachedGoals)
    return twoWayGoals.length - unreachedGoals.length;
}

/**
 * Ranks test suites based on the percentage of goals they cover.
 * Goal events are defined in the two_way() array above. An ensemble with rank
 * 100 covers all the goal events.
 *
 * @param {Event[][]} ensemble the test suite/ensemble to be ranked
 * @returns the percentage of goals covered by `ensemble`.
 */
function rankingFunction(ensemble) {
    // How many two-way goals did `ensemble` hit?
    const metGoalsCount = rankByMetGoals(ensemble);

    // What percentage of the goals did `ensemble` cover?
    const metGoalsPercent = metGoalsCount / two_way().length;

    // Convert to human-readable percentage
    return metGoalsPercent * 100;
}

//
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
//
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
//
//     return domain.length-unreachedGoals.length;
// }
//
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
//
//     // How many goals did `ensemble` hit?
//     const metGoalsCount = rankByMetGoals(ensemble);
//     // What percentage of the goals did `ensemble` cover?
//     const metGoalsPercent = metGoalsCount/domain.length;
//     return metGoalsPercent * 100; // convert to human-readable percentage
//  }