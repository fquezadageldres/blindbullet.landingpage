$(function () 
{
    $(".logo" ).click(function() 
    {
        $(".menu").find(".active").removeClass("active")
        $("#item-0").addClass('active');
        $('html, body').animate({scrollTop: $("#to-home").offset().top}, 100);
    });

    $(".menu .item" ).click(function() 
    {
        $(".menu").find(".active").removeClass("active")
        $(this).addClass('active');
    });
    
});
