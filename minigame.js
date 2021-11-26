$(function () {

    /* Start the minigame */
    var run_game = true

    /* Global var */
    var currentGun = 0
    var impact = 0
    var bulletShoted = 0
    var cooldDown = false

    /* Guns Data */
    var gun = [
        {name:"pistol",bulletSize:100,charger:11,cadence:400,timeShoot:1,numShoot:1,rangeImpac:20},
        {name:"fusil",bulletSize:200,charger:15,cadence:400,timeShoot:100,numShoot:3,rangeImpac:40},
        {name:"shotgun",bulletSize:100,charger:6,cadence:900,timeShoot:1,numShoot:20,rangeImpac:100},
        {name:"sniper",bulletSize:400,charger:3,cadence:1100,timeShoot:1,numShoot:1,rangeImpac:30}
    ]

    /* Keyboard shortcuts */
    $(document).on("keydown", async function (e) 
    {
        if (e.shiftKey && e.key === "a" || e.shiftKey && e.key === "A") 
        {
            runGame()
        }

        if (run_game && !cooldDown)
        {
            cooldDown = true

            if (e.key === "q" || e.key === "Q") 
            {
                switchWeapon()
                showBullets()
                audioPlay(gun[currentGun].name + "_Reload")
            } 
            else if (e.key === "e" || e.key === "E") 
            {
                reloadGun()
                showBullets()
                audioPlay(gun[currentGun].name + "_Reload")
            } 
            else if (e.key === "r" || e.key === "R") 
            {
                clearWindow()
            }

            await timer(1000)
            cooldDown = false; 
        }
    })

    /* Shoot with right click */
    $(".target").on("click", async function (e) {
        if (run_game && !cooldDown) 
        {
            cooldDown = true;
            shoot(e)
            await timer(gun[currentGun].cadence);
            cooldDown = false;  
        }
    })

    /* Clear bullet impact when screen resize */
    $(window).resize(function () {
        clearWindow()
    })

    /* Toggle start and finish minigame */
    function runGame() 
    {
        if (run_game) 
        {
            $(".header").css({"height":"100px"})
            $(".header.scrolled").css({"height":"70px"})
            $(".target, .wall,  .gun, .charge, .intructions-minigame").css({"display":"none"})
            $(".home-text, .player, .start-minigame").css({"display":"inherit"})
            $('html').css({"overflow-y": "inherit"})
            run_game = false;
        } 
        else 
        {
            $(".header").css({"height":"100vh"})
            $(".target, .wall, .gun").css({"display":"inherit"})
            $(".home-text, .player, .start-minigame").css({"display":"none"})
            $(".charge, .intructions-minigame").css({"display":"flex"})
            $(".gun").css({'background-image':'url("image/' + gun[currentGun].name + '.png")'})
            $('html').css({"overflow-y": "hidden"})
            showBullets()
            run_game = true;
        }
    }

    /* Switch gun */
    function switchWeapon() 
    {
        currentGun = (currentGun >= gun.length - 1 ) ? 0 : currentGun += 1;
        $(".gun" ).css({'background-image':'url("image/' + gun[currentGun].name + '.png")'})
        bulletShoted = 0;
    }

    /* Reload charge */
    async function reloadGun() 
    {
        delay_reload = true
        bulletShoted = (gun[currentGun].name == "shotgun") ? bulletShoted -= 1 : 0 ;
        bulletShoted = (bulletShoted < 0) ? 0 : bulletShoted;
        console.log(bulletShoted)
    }

    /* Update the bullets num and type */
    function showBullets() 
    {
        $(" .charge").empty();
        for (let i = 0; i < (gun[currentGun].charger - bulletShoted); i++) 
        {
            $(".charge").css({'width': gun[currentGun].charger * 20})
            $(".charge").append('<div id="bullet-' + i + '" class="bullet"></div>')
            $("#bullet-" + i ).css({'background-image':'url("image/' + gun[currentGun].name + '_bullet.png")'})
        }
    }

    /* Play audio */
    function audioPlay(file) 
    {
        const audio = new Audio("sound/" + file +".wav");
        audio.play();
    }

    /* Shoot */
    async function shoot(e) 
    {
        if (bulletShoted < gun[currentGun].charger) 
        {
            for (var i = 0; i < gun[currentGun].numShoot; i++) 
            {
                $(" .wall").append('<div id="impact-' + impact + '" class="impact"></div>');
                $("#impact-" + impact ).css({
                    "top":e.offsetY - (gun[currentGun].bulletSize / 2 + getRandomInt(-gun[currentGun].rangeImpac, gun[currentGun].rangeImpac) ) + "px",
                    "left":e.offsetX - (gun[currentGun].bulletSize / 2 + getRandomInt(-gun[currentGun].rangeImpac, gun[currentGun].rangeImpac)) + "px",
                    "height": gun[currentGun].bulletSize + "px", 
                    "width": gun[currentGun].bulletSize + "px",
                    "transform":"rotate(" + getRandomInt(0, 360)  + "deg)"
                })
                
                if (gun[currentGun].name != "shotgun") 
                {
                    updateVarShoot()
                }
                impact += 1;
                await timer(gun[currentGun].timeShoot);
            }

            if (gun[currentGun].name == "shotgun") 
            {
                updateVarShoot()
            }   
        } 
        else 
        {
            audioPlay("noBullet")
        }
    }

    /* Update bullet shoot */
    function updateVarShoot() {
        audioPlay(gun[currentGun].name + "_Shot")
        bulletShoted += 1
        showBullets()
    }

    /* Clear the impact on windows */
    function clearWindow() 
    {
        $(" .wall").empty();
        impact = 0;
    }

    /* Random func */
    function getRandomInt(min, max) 
    {
        return Math.floor(Math.random() * (max - min)) + min
    }

    /* Timer func */
    const timer = ms => new Promise(res => setTimeout(res, ms))

    runGame()
});
    
