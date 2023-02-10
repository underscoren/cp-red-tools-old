const player = {
    role: "",
    lifepath: {
        friends: [],
        enemies: [],
        lovers: [],
    },
    stats: {},
    skills: {},
    items: [],
    cyberware: [],
    eddies: 0
};


function selectRole(roleName) {
    player.role = roleName.toLowerCase();
    $("#step1").hide();
    $(`#${roleName}-lifepath`).show();
    $("#step2").slideDown(300);
}

// back button
//TODO: fix inconsistencies when changing something in a previous section (e.g. role, stats etc)
/*
$(".back-button").on("click", event => {
    const stepElement = $(event.target).parent().parent();
    stepElement.hide();
    stepElement.prev().slideDown(300); // show previous step
});
*/

// roll button click
$(".table-roll-button").on("click", event => {
    const elements = $(event.target).closest(".roll-table").find("li");
    elements.eq(Math.floor(Math.random()*elements.length)).trigger("click");
});

// reset button click
$(".table-reset-button").on("click", event => {
    const clickedElement = $(event.target);
    const parentTable = clickedElement.closest(".roll-table");
    parentTable.find("li").show();
    clickedElement.siblings(".table-roll-button").prop("disabled", false);
    clickedElement.prop("disabled", true);
    
    delete player.lifepath[parentTable.attr("id")]; // remove from lifepath
});

// hide all other list elements in table
function listClickEventHandler(event) {
    const clickedElement = $(event.target);
    if(clickedElement.siblings(":visible").length == 0) return; // already clicked
    clickedElement.siblings().each(function() {
        $(this).slideUp(200);
    });

    const parentTable = clickedElement.closest(".roll-table");
    parentTable.find(".table-roll-button").prop("disabled", true);
    parentTable.find(".table-reset-button").prop("disabled", false);

    player.lifepath[parentTable.attr("id")] = clickedElement.index();
}

$(".roll-table ul li").on("click", listClickEventHandler);

const languages = {
    "North American": ["Chinese", "Cree", "Creole", "English", "French", "Navajo", "Spanish"],
    "South/Central American": ["Creole", "English", "German", "Guarani", "Mayan", "Portuguese", "Quechua", "Spanish"],
    "Western European": ["Dutch", "English", "French", "German", "Italian", "Norwegian", "Portuguese", "Spanish"],
    "Eastern European": ["English", "Finnish", "Polish", "Romanian", "Russian", "Ukrainian"],
    "Middle Eastern/North African": ["Arabic", "Berber", "English", "Farsi", "French", "Hebrew", "Turkish"],
    "Sub-Saharan African": ["Arabic", "English", "French", "Hausa", "Lingala", "Oromo", "Portuguese", "Swahili", "Twi", "Yoruba"],
    "South Asian": ["Bengali", "Dari", "English", "Hindi", "Nepali", "Sinhalese", "Tamil", "Urdu"],
    "South East Asian": ["Arabic", "Burmese", "English", "Filipino", "Hindi", "Indonesian", "Khmer", "Malayan", "Vietnamese"],
    "East Asian": ["Cantonese Chinese", "English", "Japanese", "Korean", "Mandarin Chinese", "Mongolian"],
    "Oceania/Pacific Islander": ["English", "French", "Hawaiian", "Maori", "Pama-Nyungan", "Tahitian"],
}

// fill language list with specific languages
$("#culture ul li").on("click", event => {
    if($(event.target).siblings(":visible").length == 0) return; // already clicked

    let languageGroup = languages[$(event.target).text()];
    $("#language ul").empty();

    for(const language of languageGroup) {
        const listElement = $("<li>").append(language);
        listElement.on("click", listClickEventHandler);
        $("#language ul").append(listElement);
    }
    
    $("#language .table-roll-button").prop("disabled", false);
});


// friends


let friends = 0;

$(".friends .people-set-button").on("click", event => {
    friends = $(event.target).siblings("input").val();
    $(event.target).attr("disabled", true);
    $(event.target).siblings(".people-roll-button").attr("disabled", true);
    $(event.target).siblings("input").attr("disabled", true);
    if(friends > 0)
        $("#friends ul").slideDown(200);
});

$(".friends .people-roll-button").on("click", event => {
    $(event.target).siblings("input").val(Math.max(Math.ceil(Math.random()*10) - 7, 0));
});

$("#friends ul li").on("click", event => {
    $(event.target).parent().siblings("ol").append($("<li>").append($(event.target).text()));
    friends--;
    
    // this works because javascript arrays are too stupid to care about insertion order
    player.lifepath.friends[friends] = $(event.target).text();
    
    if(friends == 0) {
        $(event.target).parent().slideUp(200);
        $("#friends .table-roll-button").attr("disabled", true);
        $("#friends .table-reset-button").attr("disabled", false);
    }
});

// reset all friends
$("#friends .table-reset-button").unbind("click");
$("#friends .table-reset-button").on("click", event => {
    $(event.target).attr("disabled", false);
    $("#friends .table-roll-button").attr("disabled", false);
    $(".friends").children().attr("disabled", false);
    
    friends = 0;
    player.lifepath.friends = []
    $("#friends ul").hide();
    $("#friends ol").empty();
});

// roll all friends
$("#friends .table-roll-button").unbind("click");
$("#friends .table-roll-button").on("click", event => {
    if(!$(".friends input").attr("disabled")) {
        $(".friends .people-roll-button").trigger("click");
        $(".friends .people-set-button").trigger("click");
    }

    while(friends > 0) {
        $("#friends ul li").eq(Math.floor(Math.random()*10)).trigger("click");
    }

    $(event.target).attr("disabled", true);
    $("#friends .table-reset-button").attr("disabled", false);
});


//  enemies


let enemies = 0;
let enemySelection = 0;
let enemy = [];

$(".enemies .people-set-button").on("click", event => {
    enemies = $(event.target).siblings("input").val();
    enemySelection = 0;
    $(event.target).attr("disabled", true);
    $(event.target).siblings(".people-roll-button").attr("disabled", true);
    $(event.target).siblings("input").attr("disabled", true);
    if(enemies > 0) {
        $("#enemies .selection").children().eq(0).children().slideDown(200);
    }
});

$(".enemies .people-roll-button").on("click", event => {
    $(event.target).siblings("input").val(Math.max(Math.floor(Math.random()*10) - 7, 0));
});

// setup click event handlers for each column
$("#enemies .selection .col").each((colNum, element) => {
    const column = $(element).children().eq(0);
    column.children().on("click", event => {
        $("#enemies .display").children().eq(colNum).find("ol").append($("<li>").append($(event.target).text()));
        enemy[colNum] = $(event.target).text();
        
        column.slideUp(200);
        enemySelection++;
        
        if(enemySelection > 3) { // reached last column
            enemies--;
            enemySelection = 0;
            player.lifepath.enemies[enemies] = enemy;
            enemy = [];
        }
        
        if(enemies > 0) {
            // show next column
            $("#enemies .selection .col").eq(enemySelection).children().slideDown(200);
        } else {
            $("#enemies .table-reset-button").attr("disabled", false);
            $("#enemies .table-roll-button").attr("disabled", true);
        }
    });
});

// reset all enemies
$("#enemies .table-reset-button").unbind("click");
$("#enemies .table-reset-button").on("click", event => {
    $(event.target).attr("disabled", true);
    $("#enemies .table-roll-button").attr("disabled", false);
    $(".enemies").children().attr("disabled", false);

    // clear all enemy columns
    $("#enemies .display").children().each((i, element) => {
        $(element).find("ol").empty();
    });

    $("#enemies .selection").children().each((i, element) => {
        $(element).find("ul").hide();
    });

    enemies = 0;
    enemySelection = 0;
    enemy = [];
    player.lifepath.enemies = [];
});

// roll all enemies
$("#enemies .table-roll-button").unbind("click");
$("#enemies .table-roll-button").on("click", event => {
    // TODO: don't override user input when clicking
    $(".enemies .people-roll-button").trigger("click");
    let enemyCount = $(".enemies input").val();
    enemies = enemyCount;
    enemySelection = 0;
    $(".enemies").children().attr("disabled", true);

    while(enemyCount > 0) {
        // choose from all 3 columns at random
        $("#enemies .selection").children().each((colNum, element) => {
            $(element).find("li").eq(Math.floor(Math.random()*10)).trigger("click")
        });
        enemyCount--;
    }

    $(event.target).attr("disabled", true);
    $("#enemies .table-reset-button").attr("disabled", false);
});


// TODO: remove duplicate code (consolidate into generic function?)
// lovers


let lovers = 0;

$(".lovers .people-set-button").on("click", event => {
    lovers = $(event.target).siblings("input").val();
    $(event.target).attr("disabled", true);
    $(event.target).siblings(".people-roll-button").attr("disabled", true);
    $(event.target).siblings("input").attr("disabled", true);
    if(lovers > 0)
        $("#lovers ul").slideDown(200);
});

$(".lovers .people-roll-button").on("click", event => {
    $(event.target).siblings("input").val(Math.max(Math.ceil(Math.random()*10) - 7, 0));
});

$("#lovers ul li").on("click", event => {
    $(event.target).parent().siblings("ol").append($("<li>").append($(event.target).text()));
    lovers--;
    
    player.lifepath.lovers[lovers] = $(event.target).text();

    if(lovers == 0) {
        $(event.target).parent().slideUp(200);
        $("#lovers .table-roll-button").attr("disabled", true);
        $("#lovers .table-reset-button").attr("disabled", false);
    }
});

// reset all lovers
$("#lovers .table-reset-button").unbind("click");
$("#lovers .table-reset-button").on("click", event => {
    $(event.target).attr("disabled", false);
    $("#lovers .table-roll-button").attr("disabled", false);
    $(".lovers").children().attr("disabled", false);
    

    lovers = 0;
    player.lifepath.lovers = [];
    $("#lovers ul").hide();
    $("#lovers ol").empty();
});

// roll all lovers
$("#lovers .table-roll-button").unbind("click");
$("#lovers .table-roll-button").on("click", event => {
    $(".lovers .people-roll-button").trigger("click");
    $(".lovers .people-set-button").trigger("click");

    while(lovers > 0) {
        $("#lovers ul li").eq(Math.floor(Math.random()*10)).trigger("click");
    }

    $(event.target).attr("disabled", true);
    $("#lovers .table-reset-button").attr("disabled", false);
});


//  choices


$(".choice-roll-button").on("click", event => {
    const choices = $(event.target).closest(".choice-box").find(".choice").children();
    choices.eq(Math.floor(Math.random()*choices.length)).trigger("click");
});

$(".choice-reset-button").on("click", event => {
    const choices = $(event.target).closest(".choice-box").find(".choice").children();
    choices.each((i, choice) => {
        $(choice).attr("disabled", false);
        $(choice).show();
        if($(choice).data("show-element")) {
            const shownElement = $($(choice).data("show-element"))
            shownElement.find(".table-reset-button, .choice-reset-button").trigger("click");
            shownElement.hide();
        }
    });

    $(event.target).attr("disabled", true);
    $(event.target).siblings(".choice-roll-button").attr("disabled", false);
});

// choice selection
$(".choice button").on("click", event => {
    $(event.target).attr("disabled", true);
    $(event.target).siblings().attr("disabled", true);
    $(event.target).siblings().hide();
    const shownElement = $(event.target).data("show-element");
    if(shownElement) 
        $(shownElement).slideDown(200);
    
    const parent = $(event.target).closest(".choice-box");
    parent.find(".choice-roll-button").attr("disabled", true);
    parent.find(".choice-reset-button").attr("disabled", false);
});

// all tables

function rollChoiceRecursive(element) {
    element.find(".choice-roll-button").trigger("click");
    const shownElement = element.find(".choice button:visible").data("show-element");
    if(shownElement) {
        if($(shownElement).hasClass("choice-box"))
            rollChoiceRecursive($(shownElement));
        else {
            // bugged, for some reason doesn't trigger properly
            //$(shownElement).find(".table-roll-button").trigger("click");
            
            // temp fix: manually select option
            const elements = $(shownElement).find("li");
            element.eq(Math.floor(Math.random()*elements.length)).trigger("click");
        }
    }
}

$("#roll-all-tables").on("click", () => {
    $(".choice-box:visible").each((i, element) => {
        rollChoiceRecursive($(element));
    });
    $(".table-roll-button:visible:not([disabled])").trigger("click");
});

$("#reset-all-tables").on("click", () => {
    $(".table-reset-button").trigger("click");
    $(".choice-reset-button").trigger("click");
});

$("#lifepath-done").on("click", () => {
    $("#step2").hide();
    $("#step3").slideDown(300);
});


//  stats


const statblock = {
    rockerboy: {
        int: [7,3,4,4,3,5,5,5,3,4],
        ref: [6,7,5,5,7,6,6,7,5,5],
        dex: [6,7,7,7,7,7,6,7,5,6],
        tech: [5,7,7,7,7,5,7,5,6,5],
        cool: [6,7,6,6,6,7,6,7,7,8],
        will: [8,6,6,8,8,8,8,6,8,8],
        luck: [7,7,7,7,6,5,7,6,7,7],
        move: [7,7,7,6,5,7,6,6,5,6],
        body: [3,5,5,3,4,3,3,4,5,4],
        emp: [8,8,8,8,7,7,6,8,7,7],
    },
    solo: {
       int: [6,7,5,5,6,7,7,7,7,6],
       ref: [7,8,8,8,6,7,7,8,7,6],
       dex: [7,6,7,6,7,6,6,7,6,8],
       tech: [3,3,4,4,5,5,5,5,4,5],
       cool: [8,6,7,6,7,7,6,6,6,6],
       will: [6,6,7,7,6,6,7,6,6,6],
       luck: [5,7,6,6,7,6,7,5,6,5],
       move: [5,5,7,5,6,7,6,6,5,6],
       body: [6,6,8,7,8,7,6,8,6,6],
       emp: [5,6,5,6,4,5,6,4,5,5],
    },
    netrunner: {
        int: [5,5,5,5,5,6,6,5,7,7],
        ref: [8,6,6,7,8,6,6,7,6,8],
        dex: [7,7,8,7,8,6,6,8,7,6],
        tech: [7,5,6,7,5,7,7,6,7,6],
        cool: [7,8,6,7,7,8,6,8,6,6],
        will: [4,3,4,5,3,4,5,4,3,4],
        luck: [8,8,7,8,7,7,7,8,6,7],
        move: [7,7,6,6,5,7,7,5,5,7],
        body: [7,5,7,5,5,6,7,7,6,5],
        emp: [4,5,4,5,6,6,6,4,5,6]
    },
    tech: {
        int: [6,7,8,7,6,8,8,8,6,8],
        ref: [7,6,6,8,6,7,6,8,6,8],
        dex: [7,6,5,7,7,5,7,7,7,5],
        tech: [8,7,7,8,6,6,8,8,8,6],
        cool: [4,5,5,4,4,3,4,5,3,4],
        will: [4,3,4,4,3,3,4,4,3,4],
        luck: [5,7,7,6,7,7,7,6,5,6],
        move: [5,7,7,5,7,6,6,5,7,5],
        body: [7,5,5,6,6,6,7,6,7,6],
        emp: [6,5,7,7,6,7,6,6,7,6]
    },
    medtech: {
        int: [7,6,6,8,6,8,8,6,6,8],
        ref: [5,7,5,7,7,5,6,5,6,7],
        dex: [6,7,5,6,5,5,5,7,7,6],
        tech: [7,7,8,8,7,8,8,7,7,6],
        cool: [5,4,5,3,5,5,5,3,5,3],
        will: [3,4,3,5,5,5,4,5,4,4],
        luck: [8,6,8,6,8,6,8,8,6,8],
        move: [5,7,5,6,7,6,5,5,6,7],
        body: [5,7,7,5,6,5,7,5,5,6],
        emp: [7,7,8,7,8,6,7,8,6,7]
    },
    media: {
        int: [6,8,6,6,6,7,8,6,7,7],
        ref: [6,7,7,5,6,5,5,5,7,6],
        dex: [5,7,7,7,7,5,6,6,5,6],
        tech: [5,3,5,5,4,4,3,5,4,3],
        cool: [8,6,6,6,8,8,7,6,6,7],
        will: [7,6,8,7,7,7,6,8,7,6],
        luck: [5,6,5,5,6,6,6,6,6,7],
        move: [7,5,5,5,7,7,5,6,5,6],
        body: [5,6,5,6,5,5,6,7,6,7],
        emp: [7,8,7,6,8,8,7,8,7,6]
    },
    lawman: {
        int: [5,6,5,6,6,7,7,5,7,6],
        ref: [6,6,7,6,6,6,8,6,7,6],
        dex: [7,6,7,7,7,5,7,6,5,5],
        tech: [5,5,7,6,6,5,5,5,5,6],
        cool: [7,6,6,6,7,7,6,6,7,8],
        will: [8,8,7,8,7,8,8,8,7,7],
        luck: [5,5,5,5,6,5,7,5,6,5],
        move: [6,7,5,7,5,6,6,7,5,7],
        body: [5,5,7,7,5,7,5,6,5,6],
        emp: [6,5,6,6,6,4,4,4,6,6]
    },
    exec: {
        int: [8,8,8,8,7,5,6,6,7,7],
        ref: [5,6,7,5,7,7,6,7,6,7],
        dex: [5,6,6,7,6,7,7,7,7,5],
        tech: [3,4,3,5,5,3,5,3,5,5],
        cool: [8,7,8,6,8,6,8,7,7,8],
        will: [6,6,6,5,5,7,7,5,5,6],
        luck: [6,7,7,6,7,6,6,7,7,6],
        move: [5,7,6,5,7,5,7,5,6,7],
        body: [5,5,4,5,5,5,4,5,5,4],
        emp: [7,7,5,7,6,7,6,7,5,7]
    },
    fixer: {
        int: [8,8,6,7,8,8,8,6,8,6],
        ref: [5,5,6,7,6,7,6,6,7,5],
        dex: [7,5,6,5,6,5,6,7,7,6],
        tech: [4,5,4,5,3,5,5,4,5,5],
        cool: [6,6,5,7,6,6,6,7,5,5],
        will: [5,7,6,6,5,7,5,6,5,6],
        luck: [8,8,8,7,8,7,6,7,7,8],
        move: [5,7,6,7,7,5,7,7,6,6],
        body: [5,5,3,5,5,3,5,4,5,4],
        emp: [8,7,8,8,6,6,8,7,7,7]
    },
    nomad: {
        int: [6,5,5,5,6,7,6,5,6,5],
        ref: [6,7,8,8,6,6,7,7,7,6],
        dex: [8,6,6,7,6,8,8,8,6,7],
        tech: [3,5,3,4,3,4,4,3,4,4],
        cool: [6,8,8,8,6,6,6,8,8,7],
        will: [7,8,7,6,7,7,6,6,6,8],
        luck: [6,8,6,7,6,6,7,7,6,7],
        move: [6,7,5,7,7,5,5,5,6,7],
        body: [6,5,6,7,7,6,7,5,6,7],
        emp: [4,4,5,5,4,5,5,5,6,4]
    }
}

function updateDerivedStats() {
    const BODY = parseInt($("#body").val());
    const WILL = parseInt($("#will").val());

    const HP = 10 + 5 * Math.ceil((BODY + WILL) / 2);
    $("#hp").val(HP);
    player.stats.hp = HP;
    $("#seriously-wounded").val(Math.ceil(HP / 2));
    player.stats["seriously-wounded"] = Math.ceil(HP / 2);
    $("#death-save").val(BODY);
    player.stats["death-save"] = BODY;
    
    const EMP = parseInt($("#emp").val());
    $("#humanity").val(EMP*10);
    player.stats.humanity = EMP*10;
}

$("#stat-roll-block").on("click", event => {
    const stats = statblock[player.role];
    const row = Math.floor(Math.random() * 10);
    
    for(const [stat, levels] of Object.entries(stats)) {
        const level = levels[row]
        $("#"+stat).val(level);
        player.stats[stat] = level;
    }

    updateDerivedStats()

    $(event.target).attr("disabled", true);
    $(event.target).siblings().hide();
});

$("#stat-roll-individual").on("click", event => {
    const stats = statblock[player.role];
    
    for(const [stat, levels] of Object.entries(stats)) {
        const level = levels[Math.floor(Math.random() * 10)];
        $("#"+stat).val(level);
        player.stats[stat] = level;
    }

    updateDerivedStats()

    $(event.target).attr("disabled", true);
    $(event.target).siblings().hide();
});

$("#stat-point-buy").on("click", event => {
    $("#stat-info").slideDown(200);
    $("#stat-block input").attr("disabled", false);
    $("#stat-block input").val("5");
    $("#stat-block input").eq(0).trigger("input");
    
    $(event.target).attr("disabled", true);
    $(event.target).siblings().hide();
});

$("#stat-block input").on("input", () => {
    let points = 0;
    $("#stat-block input").each((i, element) => {
        points += parseInt($(element).val());
        player.stats[$(element).attr("id")] = parseInt($(element).val);
    });

    updateDerivedStats()
    
    $("#stat-remaining").text(62 - points);
    $("#point-buy-done").attr("disabled", points != 62);

});

$("#point-buy-done").on("click", event => {
    $(event.target).attr("disabled", true);
    $("#stat-block input").attr("disabled", true);
    $("#stat-info").slideUp(200);
});


//  skills


const skillblock = {
    rockerboy: {"Athletics": 2,"Brawling": 6,"Concentration": 2,"Conversation": 2,"Education": 2,"Evasion": 6,"First Aid": 6,"Human Perception": 6,"Language (Streetslang)": 2,"Local Expert (Your Home)": 4,"Perception": 2,"Persuasion": 6,"Stealth": 2,"Composition": 6,"Handgun": 6,"Melee Weapon": 6,"Personal Grooming": 4,"Play Instrument*": 6,"Streetwise": 6,"Wardrobe & Style": 4},
    solo: {"Athletics": 2,"Brawling": 2,"Concentration": 2,"Conversation": 2,"Education": 2,"Evasion": 6,"First Aid": 6,"Human Perception": 2,"Language (Streetslang)": 2,"Local Expert (Your Home)": 2,"Perception": 6,"Persuasion": 2,"Stealth": 2,"Autofire (x2)": 6,"Handgun": 6,"Interrogation": 6,"Melee Weapon": 6,"Resist Torture/Drugs": 6,"Shoulder Arms": 6,"Tactics": 6},
    netrunner: {"Athletics": 2,"Brawling": 2,"Concentration": 2,"Conversation": 2,"Education": 6,"Evasion": 6,"First Aid": 2,"Human Perception": 2,"Language (Streetslang)": 2,"Local Expert (Your Home)": 2,"Perception": 2,"Persuasion": 2,"Stealth": 6,"Basic Tech": 6,"Conceal/Reveal Object": 6,"Cryptography": 6,"Cybertech": 6,"Electronics/Security Tech (x2)": 6,"Handgun": 6,"Library Search": 6},
    tech: {"Athletics": 2,"Brawling": 2,"Concentration": 2,"Conversation": 2,"Education": 6,"Evasion": 6,"First Aid": 6,"Human Perception": 2,"Language (Streetslang)": 2,"Local Expert (Your Home)": 2,"Perception": 2,"Persuasion": 2,"Stealth": 2,"Basic Tech": 6,"Cybertech": 6,"Electronics/Security Tech (x2)": 6,"Land Vehicle Tech": 6,"Shoulder Arms": 6,"Science*": 6,"Weaponstech": 6},
    medtech: {"Athletics": 2,"Brawling": 2,"Concentration": 2,"Conversation": 6,"Education": 6,"Evasion": 6,"First Aid": 2,"Human Perception": 6,"Language (Streetslang)": 2,"Local Expert (Your Home)": 2,"Perception": 2,"Persuasion": 2,"Stealth": 2,"Basic Tech": 6,"Cybertech": 4,"Deduction": 6,"Paramedic (x2)": 6,"Resist Torture/Drugs": 4,"Science*": 6,"Shoulder Arms": 6},
    media: {"Athletics": 2,"Brawling": 2,"Concentration": 2,"Conversation": 6,"Education": 2,"Evasion": 6,"First Aid": 2,"Human Perception": 6,"Language (Streetslang)": 2,"Local Expert (Your Home)": 6,"Perception": 6,"Persuasion": 6,"Stealth": 2,"Bribery": 6,"Composition": 6,"Deduction": 6,"Handgun": 6,"Library Search": 4,"Lip Reading": 4,"Photography/Film": 4},
    lawman: {"Athletics": 2,"Brawling": 6,"Concentration": 2,"Conversation": 6,"Education": 2,"Evasion": 6,"First Aid": 2,"Human Perception": 2,"Language (Streetslang)": 2,"Local Expert (Your Home)": 2,"Perception": 2,"Persuasion": 2,"Stealth": 2,"Autofire (x2)": 6,"Criminology": 6,"Deduction": 6,"Handgun": 6,"Interrogation": 6,"Shoulder Arms": 6,"Tracking": 6},
    exec: {"Athletics": 2,"Brawling": 2,"Concentration": 2,"Conversation": 6,"Education": 6,"Evasion": 6,"First Aid": 2,"Human Perception": 6,"Language (Streetslang)": 2,"Local Expert (Your Home)": 2,"Perception": 2,"Persuasion": 6,"Stealth": 2,"Accounting": 6,"Bureaucracy": 6,"Business": 6,"Deduction": 6,"Handgun": 6,"Lip Reading": 6,"Personal Grooming": 4},
    fixer: {"Athletics": 2,"Brawling": 2,"Concentration": 2,"Conversation": 6,"Education": 2,"Evasion": 6,"First Aid": 2,"Human Perception": 6,"Language (Streetslang)": 4,"Local Expert (Your Home)": 6,"Perception": 2,"Persuasion": 4,"Stealth": 2,"Bribery": 6,"Business": 6,"Forgery": 6,"Handgun": 6,"Pick Lock": 4,"Streetwise": 6,"Trading": 6},
    nomad: {"Athletics": 2,"Brawling": 6,"Concentration": 2,"Conversation": 2,"Education": 2,"Evasion": 6,"First Aid": 6,"Human Perception": 2,"Language (Streetslang)": 2,"Local Expert (Your Home)": 2,"Perception": 4,"Persuasion": 2,"Stealth": 6,"Animal Handling": 6,"Drive Land Vehicle": 6,"Handgun": 6,"Melee Weapon": 6,"Tracking": 6,"Trading": 6,"Wilderness Survival": 6},
    defaultskills: ["Athletics","Brawling","Concentration","Conversation","Education","Evasion","First Aid","Human Perception","Language (Streetslang)","Local Expert (Your Home)","Perception","Persuasion","Stealth"]
}

function skillRemoveHandler(event) {
    const currentElement = $(event.currentTarget);
    const name = currentElement.find(".skill-name").text();
    const level = parseInt(currentElement.find(".skill-level").text());

    const isBaseSkill = skillblock.defaultskills.includes(name);

    if(!(level == 2 && isBaseSkill)) { // default skills cant be below 2
        currentElement.find(".skill-level").text(level - 1);
    }
    if(level == 1) {
        currentElement.remove();
    }

    updateSkillAmounts();
}

function addSkill(name, level) {
    const li = $("<li>").append([
        $("<span class='skill-level'>").append(level),
        $("<span class='skill-name'>").append(name),
    ]);

    li.on("click", skillRemoveHandler);
    $("#player-skill-list").append(li);
}

function updateSkillAmounts() {
    let points = 0;
    player.skills = {};

    $("#player-skill-list li").each((i, element) => {
        const name = $(element).find(".skill-name").text();
        const level = parseInt($(element).find(".skill-level").text());
        player.skills[name] = level;
        
        const isDouble = name.includes("(x2)");
        points += level * ((isDouble) ? 2 : 1);
    });

    $("#remaining-skill-points").text(86 - points);
    $("#player-skill-done").attr("disabled", points != 86);
}

$("#skill-buy-lists ul li").on("click", event => {
    const skillName = $(event.currentTarget).contents().eq(0).text();

    let existingSkill;
    $("#player-skill-list").children().each((i, element) => {
        if($(element).find(".skill-name").text().includes(skillName))
            existingSkill = $(element);
    });

    if(existingSkill) {
        const level = parseInt(existingSkill.find(".skill-level").text());
        existingSkill.find(".skill-level").text(level + 1);
    } else {
        addSkill(skillName, 1);
    }

    updateSkillAmounts();
});

$("#skill-template").on("click", event => {
    $(event.target).siblings().hide();
    $(event.target).attr("disabled", true);

    const skills = skillblock[player.role];
    for(const [skill, level] of Object.entries(skills)) 
        addSkill(skill, level);

    updateSkillAmounts();
    $("#player-skill-list li").unbind("click");
    //$("#player-skill-done").trigger("click");
    $("#player-skills").slideDown(200);
});

$("#skill-limited").on("click", event => {
    $(event.target).attr("disabled", true);
    $(event.target).siblings().hide();
    
    // hide all skills, show only those allowed to buy
    $("#skill-buy-lists ul li").hide();
    let skills = skillblock[player.role];
    for(const skill of Object.keys(skills).concat(["Language", "Local Expert"])) {
        $(`#skill-buy-lists ul li:contains("${skill}")`).show();
    }

    // add default skills
    for(const skill of skillblock.defaultskills)
        addSkill(skill, 2);
    
    updateSkillAmounts();
    $("#player-skills").slideDown(200);
    $("#skill-buy-lists").slideDown(200);
});

$("#skill-all").on("click", event => {
    $(event.target).attr("disabled", true);
    $(event.target).siblings().hide();

    // add default skills
    for(const skill of skillblock.defaultskills)
        addSkill(skill, 2);
    
    updateSkillAmounts();
    $("#player-skills").slideDown(200);
    $("#skill-buy-lists").slideDown(200);
});

$("#player-skill-done").on("click", event => {
    $("#player-skill-list").children().unbind("click");
    $("#player-skill-list").children().addClass("hover-force-active");
    $("#skill-buy-lists ul li").unbind("click");
    $("#skill-buy-lists ul li").addClass("hover-force-active");
    $("#skill-buy-lists").slideUp(200);
    $("#step3").hide();
    $("#step4").slideDown(300);
});


// items


const itemblock = {
    rockerboy: ["Very Heavy Pistol","Basic VH Pistol Ammunition x50","Heavy Melee Weapon or Flashbang Grenade","Teargas Grenade x2","Light Armorjack Body Armor (SP11)","Light Armorjack Head Armor (SP11)","Agent","Computer","Electric Guitar or Bug Detector","Glow Paint x5","Pocket Amp","Radio Scanner/Music Player","Video Camera","Generic Chic: Jacket, Jewelry x3, Top x4","Leisurewear: Jewelry, Mirrorshades, Footwear","Urbanflash: Bottoms, Top"],
    solo: ["Assault Rifle","Very Heavy Pistol","Heavy Melee Weapon or Bulletproof Shield","Basic VH Pistol Ammunition x30","Basic Rifle Ammunition x70","Light Armorjack Body Armor (SP11)","Light Armorjack Head Armor (SP11)","Agent","Leisurewear: Footwear x2, Jacket x3, Mirrorshades, Bottoms x2, Top x2"],
    netrunner: ["Very Heavy Pistol","Basic VH Pistol Ammunition x30","Light Armorjack Body Armor (SP11)","Light Armorjack Head Armor (SP11)","Agent","Cyberdeck (7 Slots)","Virtuality Goggles","Program: Armor","Program: Sword","Program: See Ya or Eraser","Program: Sword or Vrizzbolt","Program: Worm or Sword","Generic Chic: Top x10","Leisurewear: Footwear x2, Jewelry, Bottoms x2","Urban Flash: Jacket"],
    tech: ["Shotgun or Assault Rifle","Basic Shotgun Shell Ammunition x100 or Basic Rifle Ammunition x100","Flashbang Grenade","Light Armorjack Body Armor (SP11)","Light Armorjack Head Armor (SP11)","Agent","Anti-Smog Breathing Mask","Disposable Cell Phone","Duct Tape x5","Flashlight","Road Flare x6","Tech Bag","Generic Chic: Bottoms x8, Tops x10","Leisurewear: Footwear x2"],
    medtech: ["Shotgun or Assault Rifle","Basic Shotgun Shell Ammunition x100 or Basic Rifle Ammunition x100","Incendiary Shotgun Shell Ammunition x10 or Incendiary Rifle Ammunition x10","Smoke Grenade x2","Light Armorjack Body Armor (SP11)","Light Armorjack Head Armor (SP11)","Bulletproof Shield","Agent","Airhypo","Handcuffs","Flashlight","Generic Chic: Jacket x3","Glow Paint","Medtech Bag","Leisurewear: Footwear, Bottoms x3, Top x5"],
    media: ["Heavy Pistol or Very Heavy Pistol","Basic H Pistol Ammunition x50 or Basic VH Pistol Ammunition x50","Light Armorjack Body Armor (SP11)","Light Armorjack Head Armor (SP11)","Agent","Audio Recorder","Binoculars","Disposable Cellphone x2 or Grapple Gun","Flashlight","Computer","Radio Scanner/Music Player","Scrambler/Descrambler","Video Camera","Generic Chic: Footwear, Bottoms, Top","Leisurewear: Jacket","Urbanflash: Mirrorshades"],
    lawman: ["Assault Rifle or Shotgun","Heavy Pistol","Basic Rifle Ammunition x100 or Basic Shotgun Shell Ammunition x100 or Basic Slug Ammunition x100","Basic H Pistol Ammunition x30","Bulletproof Shield or Smoke Grenade x2","Light Armorjack Body Armor (SP11)","Light Armorjack Head Armor (SP11)","Agent","Flashlight","Handcuffs x2","Radio Communicator","Road Flare x10","Generic Chic: Jacket, Bottoms x2, Top x3","Leisurewear: Footwear x2, Jacket x2, Bottoms x2, Mirrorshades, Top x2"],
    exec: ["Very Heavy Pistol","Basic VH Pistol Ammunition x50","Light Armorjack Body Armor (SP11)","Light Armorjack Head Armor (SP11)","Radio Communicator x4","Scrambler/Descrambler","Businesswear: Footwear, Jacket, Bottoms, Mirrorshades, Top, Jewelry x2"],
    fixer: ["Heavy Pistol or Very Heavy Pistol","Heavy Pistol or Very Heavy Pistol","Light Melee Weapon","Basic H Pistol Ammunition x100 or Basic VH Pistol Ammunition x100","Light Armorjack Body Armor (SP11)","Light Armorjack Head Armor (SP11)","Agent","Bug Detector","Computer","Disposable Phone x2","Generic Chic: Contacts, Jewelry","Leisurewear: Mirrorshades","Urbanflash: Footwear, Jacket, Bottoms, Top"],
    nomad: ["Heavy Pistol or Very Heavy Pistol","Basic H Pistol Ammunition x100 or Basic VH Pistol Ammunition x100","Heavy Melee Weapon or Heavy Pistol","Light Armorjack Body Armor (SP11)","Light Armorjack Head Armor (SP11)","Agent","Anti-Smog Breathing Mask","Duct Tape","Flashlight","Grapple Gun","Inflatable Bed & Sleep-Bag","Medtech Bag","Radio Communicator x2","Rope","Techtool","Tent and Camping Equipment","Bohemian: Jewelry","Nomad Leathers: Top x4, Bottom x2, Footwear x2, Jacket, Hat"],
};

const cyberwareblock = {
    rockerboy: { cyberware: ["Audio Recorder","Chemskin","Cyberaudio Suite","Tech Hair"], hl: 9 },
    solo: { cyberware: ["Biomonitor","Neural Link","Sandevistan","Speedware or Wolvers"], hl: 14 },
    netrunner: { cyberware: ["Interface Plugs","Neural Link","Shift Tacts"], hl: 14 },
    tech: { cyberware: ["Cybereye","MicroOptics","Skinwatch","Tool Hand"], hl: 12 },
    medtech: { cyberware: ["Biomonitor","Cybereye","Nasal Filters or Toxin Binders","TeleOptics"], hl: 12 },
    media: { cyberware: ["Amplified Hearing or Voice Stress Analyzer","Cyberaudio Suite","Light Tattoo"], hl: 10 },
    lawman:  { cyberware: ["Hidden Holster","Subdermal Pocket"], hl: 10 },
    exec: { cyberware: ["Biomonitor or Tech Hair","Cyberaudio Suite","Internal Agent","Toxin Binders or Nasal Filters"], hl: 12 },
    fixer: { cyberware: ["Cyberaudio Suite","Internal Agent","Subdermal Pocket","Voice Stress Analyzer or Amplified Hearing"], hl: 16 },
    nomad: { cyberware: ["Interface Plugs or Wolvers","Neural Link"], hl: 14 },
};

let eddies = 0;
let humanity = 0;

function itemRowRemoveHandler(event) {
    const tr = $(event.currentTarget);
    const name = tr.find(".name").text();
    const cost = parseInt(tr.find(".cost").text());
    if(!isNaN(cost)) {
        // refund eddies
        eddies += cost;
        $(".eddies-left").text(eddies);
        player.eddies = eddies;
        
        // remove item from array
        const itemPos = player.items.findIndex(item => item[0] == name);
        player.items.splice(itemPos, 1);
        tr.remove();
    }
}

function cyberwareRowRemoveHandler(event) {
    const tr = $(event.currentTarget);
    const name = tr.find(".name").text();
    const cost = parseInt(tr.find(".cost").text());
    const hl = parseInt(tr.find(".hl").text());

    if(!isNaN(cost) && !isNaN(hl)) {
        // refund eddies
        eddies += cost;
        $(".eddies-left").text(eddies);
        player.eddies = eddies;

        // refund humanity
        humanity += hl;
        $("#new-humanity").text(humanity);
        $("#new-emp").text(Math.floor(humanity/10));
        
        player.stats.humanity = humanity;
        player.stats.emp = Math.floor(humanity/10);

        // remove cyberware from array
        const cyberwarePos = player.cyberware.findIndex(cyberware => cyberware[0] == name);
        player.cyberware.splice(cyberwarePos, 1);
        tr.remove();
    }
}

$("#items-preset").on("click", event => {
    $(event.target).attr("disabled", true);
    $(event.target).siblings("button").hide();
    $("#preset-items-message").show();

    eddies = 500;
    $(".eddies-left").text(eddies);
    player.eddies = eddies;

    const items = itemblock[player.role];
    for(const item of items) {
        const tr = $("<tr>").append([
            $("<td class='name'>").append(item),
            $("<td class='cost'>").append("N/A"),
        ]);

        tr.on("click", itemRowRemoveHandler);

        $("#items-table").append(tr);
        player.items.push(item);
    }

    const cyberpreset = cyberwareblock[player.role];

    humanity = player.stats.humanity;
    $("#start-humanity").text(humanity);
    humanity -= cyberpreset.hl;
    $("#new-humanity").text(humanity);
    $("#new-emp").text(Math.floor(humanity/10));

    player.stats.humanity = humanity;
    player.stats.emp = Math.floor(humanity/10);

    for(const item of cyberpreset.cyberware) {
        const tr = $("<tr>").append([
            $("<td class='name'>").append(item),
            $("<td class='cost'>").append("N/A"),
            $("<td class='hl'>").append("N/A")
        ]);

        tr.on("click", cyberwareRowRemoveHandler);

        $("#cyberware-table").append(tr);
        player.cyberware.push(item);
    }

    $("#purchase-items").attr("disabled", false);
    $("#purchase-cyberware").attr("disabled", false);
});

$("#items-manual").on("click", event => {
    $(event.target).attr("disabled", true);
    $(event.target).siblings("button").hide();
    $(".fasion-complete-message").show();

    eddies = 2550
    $(".eddies-left").text(eddies);

    $("#purchase-items").attr("disabled", false);
    $("#purchase-cyberware").attr("disabled", false);
});

$("#purchase-items").on("click", event => {
    const name = $("#item-name").val();
    const cost = parseInt($("#item-cost").val());

    if(cost > eddies) {
        const alert = $("#not-enough-eddies-items").clone();
        alert.show();
        $("#alerts-items").append(alert);
    } else {
        eddies -= cost;
        $(".eddies-left").text(eddies);

        const tr = $("<tr>").append([
            $("<td class='name'>").append(name),
            $("<td class='cost'>").append(cost),
        ]);

        tr.on("click", itemRowRemoveHandler);

        $("#items-table").append(tr);
        player.items.push([name, cost]);
    }
});


// cyberware


$("#purchase-cyberware").on("click", event => {
    const name = $("#cyberware-name").val();
    const cost = parseInt($("#cyberware-cost").val());
    const hl = parseInt($("#cyberware-humanity-cost").val());

    if(cost > eddies) {
        const alert = $("#not-enough-eddies-cyberware").clone();
        alert.show();
        $("#alerts-cyberware").append(alert);
    }

    if(hl > humanity) {
        const alert = $("#not-enough-humanity-cyberware").clone();
        alert.show();
        $("#alerts-cyberware").append(alert);
    }

    if(hl <= humanity && cost <= eddies) {
        eddies -= cost;
        $(".eddies-left").text(eddies);

        humanity -= hl;
        $("#new-humanity").text(humanity);
        $("#new-emp").text(Math.floor(humanity/10));

        const tr = $("<tr>").append([
            $("<td class='name'>").append(name),
            $("<td class='cost'>").append(cost),
            $("<td class='hl'>").append(hl)
        ]);

        tr.on("click", cyberwareRowRemoveHandler);

        $("#cyberware-table").append(tr);
        player.cyberware.push([name, cost, hl]);
    }
});


//  finished character


function loadPlayer(player) {
    $("#role-name").text(player.role);
    
    // generic lifepath
    $("#main-lifepath .roll-table").each((i, element) => {
        const lifepathID = $(element).attr("id");
        const lifepathValue = player.lifepath[lifepathID];

        const lifepathName = $(element).find("h5").text();
        const lifepathResult = $(element).find("li").eq(lifepathValue).text();

        const li = $("<li>").append([
            $("<span class='title'>").append(lifepathName),
            $("<span>").append(lifepathResult),
        ]);

        $("#lifepath-generic").append(li);
    });

    // fix culture-dependent language
    const cultureName = $("#lifepath-generic li").eq(0).find("span:not(.title)").text();
    const languageValue = languages[cultureName][player.lifepath.language];
    $("#lifepath-generic li").eq(1).find("span:not(.title)").text(languageValue);

    // role-specific lifepath
    const lifepathEntries = Object.entries(player.lifepath);
    const roleLifepathEntries = lifepathEntries.filter(entry => entry[0].startsWith(player.role));
    for(const [lifepathID, lifepathValue] of roleLifepathEntries) {
        const lifepathName = $("#"+lifepathID).find("h5").text();
        const lifepathResult = $("#"+lifepathID).find("li").eq(lifepathValue).text();

        const li = $("<li>").append([
            $("<span class='title'>").append(lifepathName),
            $("<span>").append(lifepathResult)
        ]);

        $("#lifepath-role").append(li);
    }

    // people
    for(const friend of player.lifepath.friends) {
        const li = $("<li>").append(friend);

        $("#lifepath-friends").append(li);
    }

    for(const lover of player.lifepath.lovers) {
        const li = $("<li>").append(lover);

        $("#lifepath-lovers").append(li);
    }

    for(const enemy of player.lifepath.enemies) {
        for(const i in enemy) {
            const li = $("<li>").append(enemy[i]);

            $("#lifepath-enemies-"+i).append(li);
        }
    }

    // stats
    for(const [name, value] of Object.entries(player.stats)) {
        $(`#${name}-final`).val(value);
    }
    
    // skills
    for(const [name, value] of Object.entries(player.skills)) {
        const li = $("<li>").append([
            $("<span class='title'>").append(name),
            $("<span>").append(value)
        ]);

        $("#skills-final").append(li);
    }

    // items
    for(const item of player.items) {
        const li = $("<li>").append(item);

        $("#items-final").append(li);
    }

    // cyberware
    for(const cyberware of player.cyberware) {
        const li = $("<li>").append(cyberware);

        $("#cyberware-final").append(li);
    }

    // eddies
    $("#eddies-final").text(player.eddies);

    // set url
    const playerdata = btoa(JSON.stringify(player));
    const url = new URL(window.location.href);
    url.searchParams.set("player", playerdata);
    window.history.pushState(null, null, url);

    $("#finished-char-url").val(window.location.href);
}

$("#finish-character").on("click", event => {
    $("#step4").hide();
    $("#finished-character").slideDown(300);

    loadPlayer(player);
});

// check if url has character data
const url = new URL(window.location.href);
if(url.searchParams.has("player")) {
    $("#step1").hide();
    $("#finished-character").show();
    const url = new URL(window.location.href);
    const playerbase64 = url.searchParams.get("player");
    const playerdata = JSON.parse(atob(playerbase64));
    console.log(playerdata);
    
    loadPlayer(playerdata);
}