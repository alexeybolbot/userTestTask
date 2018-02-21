function checkUser() {
    const firstName = $('#firstName').val();

    $.ajax({
        type: 'POST',
        url: '/user',
        data: { firstName: firstName },
        success: function(result){
            console.log(result);
        }
    });
}