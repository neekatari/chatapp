$(document).ready(function() {
    console.log('hello');

    var socket = io();
    console.log(socket);
    var room = $('#roomName').val();
    var sender = $('#sender').val();
    socket.on('connect', function() {
        var params = {
            sender: sender,
            mySocketId: socket.id      
        }
        socket.emit('joinRequest', params, function(){
            console.log('params');
        });
    });
    socket.on('newFriendRequest', function(friend){
        $('#reload').load(location.href + ' #reload');

        $(document).on('click', '#accept_friend', function(){
           // console.log('acp clicked');
            var senderId = $('#senderId').val();
            var senderName = $('#senderName').val();
            
            $.ajax({
                url: '/room/'+room,
                type: 'POST',
                data: {
                    senderId: senderId,
                    senderName: senderName
                },
                success: function(){
                     $(this).parent().eq(1).remove();
                }
            });
            $('#reload').load(location.href + ' #reload');
        });

        $(document).on('click', '#cancel_friend', function(){
            // console.log('acp clicked');
            var user_Id = $('#user_Id').val();

             
             $.ajax({
                 url: '/room/'+room,
                 type: 'POST',
                 data: {
                     user_Id: user_Id
                 },
                 success: function(){
                      $(this).parent().eq(1).remove();
                 }
             });
             $('#reload').load(location.href + ' #reload');
         });

    });

    


   $('#add_friend').on('submit', function(e){
       e.preventDefault();
       var receiverName = $('#receiverName').val();
       $.ajax({
           url: '/room/'+room,
           type: 'POST',
           data: {
                receiverName: receiverName
           },
           success: function(){
               socket.emit('friendRequest', {
                    receiver: receiverName,
                    sender: sender, 
                    //receiverSocketId: 
               }, function() {
                   console.log('Request sent');
               })
           }
       })
   });
   $('#accept_friend').on('click', function(){
       console.log('acp clicked');
       var senderId = $('#senderId').val();
       var senderName = $('#senderName').val();
       
       $.ajax({
           url: '/room/'+room,
           type: 'POST',
           data: {
               senderId: senderId,
               senderName: senderName
           },
           success: function(){
                $(this).parent().eq(1).remove();
           }

       });
       $('#reload').load(location.href + ' #reload');
   });

   $('#cancel_friend').on('click', function(){
    var user_Id = $("user_Id").val();

    $.ajax({
        url: '/room/'+room,
        type: 'POST',
        data: {
            user_Id: user_Id
        },
        success: function(){
             $(this).parent().eq(1).remove();
        }

    });
    $('#reload').load(location.href + ' #reload');
});

});