// shop cart
var totalNumber = 0;

$('.single-item').each(function(){

    // variables
    var itemBought = parseInt($(this).find('.cart-item-selected-count').find('.number').val());
    $(this).find('.cart-item-selected-count').find('.number').wrap('<span class="number-replace"></span>');
    $('.cart-item-selected-count').each(function(){
        $(this).find('.number-replace').html(itemBought);
    });

    var incrementBTN = $(this).find('.increment-number');
    var decreamentBTN = $(this).find('.decreament-number');
    var totalOneItem = parseInt($(this).find('.total-price-for-this-item').data('val'));
    var currentVal = parseInt($(this).find('.total-price-for-this-item').data('current'));
    totalOneItem = itemBought * currentVal;

    var totalPriceForSingleItem = $(this).find('.total-price-for-this-item');
    totalPriceForSingleItem.html('₹' + totalOneItem);

    var singlePrice = $(this).find('.single-price').html('₹' + currentVal);

    // plus button
    incrementBTN.on('click', function(){
        itemBought++; 
        $(this).siblings('.number-replace').html(itemBought);
       
        totalOneItem = itemBought * currentVal;
        totalPriceForSingleItem.html('₹' + totalOneItem);
        totalNumber += currentVal;
        $('.total-calculate').find('.number').html('₹' + totalNumber);
        $('.cart-total').find('.sub-total').html('₹' + totalNumber);
        $('.cart-total').find('.order-total').html('₹' + totalNumber);
    });

    // minus button
    decreamentBTN.on('click', function(){
        if(itemBought > 1) {
            itemBought--;
            $(this).siblings('.number-replace').html(itemBought);
            totalOneItem = itemBought * currentVal;
            totalPriceForSingleItem.html('₹' + totalOneItem);
            totalNumber -= currentVal;
            $('.total-calculate').find('.number').html('₹' + totalNumber);
            $('.cart-total').find('.sub-total').html('₹' + totalNumber);
            $('.cart-total').find('.order-total').html('₹' + totalNumber);
        }
    });
    
    totalNumber += totalOneItem;

    $('.total-calculate').find('.number').html('₹' + totalNumber);
    $('.cart-total').find('.sub-total').html('₹' + totalNumber);
    $('.cart-total').find('.order-total').html('₹' + totalNumber);

    var minusThisPrice = 0;
    $(this).find('.remove-item').on('click', function(){
        var totalForSingle = $(this).parents('.single-item').find('.total-price-for-this-item').html();
        var D_totalForSingle = parseInt(totalForSingle.replace(/\$|,/g, ''));
        minusThisPrice = D_totalForSingle;

        totalNumber -= minusThisPrice;

        $('.total-calculate').find('.number').html('₹' + totalNumber);
        $('.cart-total').find('.sub-total').html('₹' + totalNumber);
        $('.cart-total').find('.order-total').html('₹' + totalNumber);

        $(this).parents('.single-item').remove();

        // cart is empty
        var shopCartSection = $('.shop-cart');
        var cartIzEmptySection = $('.cart-iz-empty');
        var cartLength = $('.single-item').length;

        function cartIzEmpty() {
            if(cartLength <= 0) {
                shopCartSection.html(cartIzEmptySection);
                cartIzEmptySection.find('.cart-empty-content').css('display', 'block');
            } else {
                console.log(cartLength + 'items is carted');
            }
        }
        cartIzEmpty();
    });
   
});












