// @provengo summon ctrl

//  Two way coverage : openCart
/**
 * Generates pairs of events for two-way coverage while excluding blocked pairs.
 * This ensures both single events and valid sequences are tested.
 */
const generateFilteredTwoWayCoverage = (events, blockedPairs) => {
    const pairs = [];
    for (let i = 0; i < events.length; i++) {
        for (let j = 0; j < events.length; j++) {
            const pair = [events[i], events[j]];
            if (!isBlockedPair(pair, blockedPairs)) {
                pairs.push(pair);
            }
        }
    }
    return pairs;
};

/**
 * Checks if a given event pair is in the list of blocked pairs.
 * @param {Array} pair The event pair to check.
 * @param {Array} blockedPairs The list of blocked pairs.
 * @returns {boolean} True if the pair is blocked, false otherwise.
 */
const isBlockedPair = (pair, blockedPairs) => {
    return blockedPairs.some(
        blockedPair =>
            JSON.stringify(pair) === JSON.stringify(blockedPair)
    );
};

/**
 * List of events of interest.
 */
const events = [
    Event('setup_end'),
    Event('ProductAddedToWishlist'),
    Event('product_deleted'),
    Event('AdminLoggedIn'),
    Event('AdminProductsPage'),
    Event('ProductAdded'),
    Event('UserLoggedIn'),
    Event('ProductSearched'),
];

/**
 * List of blocked pairs that do not make sense in the system.
 */
const blockedPairs = [
    // Admin-related actions
    [Event('AdminLoggedIn'), Event('ProductAddedToWishlist')], // Admin shouldn't add products to the wishlist
    // Setup-related sequences
    [Event('setup_end'), Event('ProductAddedToWishlist')], // Same as above for wishlist addition
    [Event('setup_end'), Event('ProductSearched')], // Searching for products should happen after setup ends

    // User actions that conflict with setup or admin actions
    [Event('UserLoggedIn'), Event('setup_end')], // User login after setup ends, setup should be first
    [Event('ProductAddedToWishlist'), Event('ProductDeleted')], // A product shouldn't be added to a wishlist if it's deleted

    // Product action conflicts
    [Event('ProductAddedToWishlist'), Event('product_deleted')], // Adding a product to a wishlist and deleting it might be contradictory
    [Event('ProductAdded'), Event('ProductSearched')], // Adding a product and searching for it in the same sequence may not make sense
    
    // Invalid transitions
    [Event('ProductAdded'), Event('AdminProductsPage')], // Admin viewing the products page before products are added
    [Event('ProductSearched'), Event('AdminProductsPage')], // Admin should be on the products page only after a search or directly via admin actions
    [Event('AdminProductsPage'), Event('setup_end')], // Admin shouldn't access products page before setup ends

    // Rare edge cases
    [Event('UserLoggedIn'), Event('setup_end')], // User login might happen only after setup is completed
    [Event('ProductSearched'), Event('UserLoggedIn')], // User searches before logging in
    [Event('ProductDeleted'), Event('UserLoggedIn')], // User logged in after a product deletion might conflict with the user's session
];

/**
 * Two-way coverage pairs: All valid pairs of events, excluding blocked ones.
 */
const twoWayPairs = generateFilteredTwoWayCoverage(events, blockedPairs);

/**
 * Ranks a test suite by how many two-way event pairs it covers, considering blocked pairs.
 *
 * @param {Event[][]} ensemble The test suite to be ranked.
 * @returns The percentage of two-way pairs covered by the test suite.
 */
function rankByTwoWayCoverage(ensemble) {
    const uncoveredPairs = new Set(twoWayPairs.map(pair => JSON.stringify(pair)));

    for (let testIdx = 0; testIdx < ensemble.length; testIdx++) {
        let test = ensemble[testIdx];
        for (let eventIdx = 0; eventIdx < test.length - 1; eventIdx++) {
            let pair = [test[eventIdx], test[eventIdx + 1]];
            let pairString = JSON.stringify(pair);
            if (uncoveredPairs.has(pairString)) {
                uncoveredPairs.delete(pairString);
            }
        }
    }

    const totalPairs = twoWayPairs.length;
    const coveredPairs = totalPairs - uncoveredPairs.size;
    return (coveredPairs / totalPairs) * 100; // percentage of two-way pairs covered
}

/**
 * Ranking function for two-way coverage.
 * Uses rankByTwoWayCoverage to calculate percentage.
 *
 * @param {Event[][]} ensemble The test suite/ensemble to be ranked.
 * @returns The percentage of two-way coverage achieved.
 */
function rankingFunction(ensemble) {
    return rankByTwoWayCoverage(ensemble);
}



//  domain : openCart

// /**
//  * List of events "of interest" that we want test suites to cover.
//  */
// const domain = [
//     Event('setup_end'),
//     Event('ProductAddedToWishlist'),
//     Event('product_deleted'),
//     Event('AdminLoggedIn'),
//     Event('AdminProductsPage'),
//     Event('ProductAdded'),
//     Event('UserLoggedIn'),
//     Event('ProductSearched'),
//     Event('ProductAddedToWishlist'),  
// ];

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