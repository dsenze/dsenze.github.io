//  $(".open-menu-button").hide()
//  $(".close-menu-button").hide()
$(".open-menu-button").click(function() {
    $(".filter-map-content").show()
    $('.responsive-menu').toggleClass('expand')
    $('.open-menu-button').hide()

});
$(".close-menu-button").click(function() {
    $(".filter-map-content").hide()
    $('.open-menu-button').show()
    $('.responsive-menu').removeClass('expand')
});