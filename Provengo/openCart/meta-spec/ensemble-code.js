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

const  two_way = function () {
    return [
        {
            event1: Event('aboutToDeleteProduct'),
            event2: Event('Start(userAddProductToWishlist)'),
            relation: 'blocks'
        },
        {
            event1: Event('setup_end'),
            event2: Event('Start(userLogin)'),
            relation: 'enables'
        },
        {
            event1: Event('setup_end'),
            event2: Event('Start(adminLogin)'),
            relation: 'enables'
        }
    ];
};


/**
 * Ranks test suites by how many events from the GOALS array were met.
 * The more goals are met, the higher the score.
 * 
 * It make no difference if a goal was met more then once.
 *
 * @param {Event[][]} ensemble The test suite to be ranked.
 * @returns Number of events from GOALS that have been met.
 */
function rankByMetGoals( ensemble ) {
    const unreachedGoals = [];
    for ( let idx=0; idx< domain.length; idx++ ) {
        unreachedGoals.push(domain[idx]);
    }

    for (let testIdx = 0; testIdx < ensemble.length; testIdx++) {
        let test = ensemble[testIdx];
        for (let eventIdx = 0; eventIdx < test.length; eventIdx++) {
            let event = test[eventIdx];
            for (let ugIdx=unreachedGoals.length-1; ugIdx >=0; ugIdx--) {
                let unreachedGoal = unreachedGoals[ugIdx];
                if ( unreachedGoal.contains(event) ) {
                    unreachedGoals.splice(ugIdx,1);
                }
            }
        }
    }

    return domain.length-unreachedGoals.length;
}

/**
 * Ranks potential test suites based on the percentage of goals they cover.
 * Goal events are defined in the GOALS array above. An ensemble with rank
 * 100 covers all the goal events.
 *
 * Multiple ranking functions are supported - to change ranking function,
 * use the `ensemble.ranking-function` configuration key, or the 
 * --ranking-function <functionName> command-line parameter.
 *
 * @param {Event[][]} ensemble the test suite/ensemble to be ranked
 * @returns the percentage of goals covered by `ensemble`.
 */
 function rankingFunction(ensemble) {

    // How many goals did `ensemble` hit?
    const metGoalsCount = rankByMetGoals(ensemble);
    // What percentage of the goals did `ensemble` cover?
    const metGoalsPercent = metGoalsCount/domain.length;
    return metGoalsPercent * 100; // convert to human-readable percentage

 }

