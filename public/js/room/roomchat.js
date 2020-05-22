$(document).ready(function(){
    var socket = io();

    var room = $('#roomName').val();
    var sender = $('#sender').val();

    socket.on('connect', function() {
        console.log('yeh! User Connected');
        var params ={
            room: room,
            name: sender
        }
        socket.emit('join', params, function(){
            console.log('User has joined this channel');
        });
    });

    socket.on('userList', function(users) {
        console.log(users);

       
        var ol = $("<ul class='list-group list-group-flush'></ul>");
        for(var i = 0; i< users.length; i++){
        ol.append("<a id='val' style='cursor: pointer;' data-toggle='modal' data-target='#myModal' ><li class='list-group-item d-flex align-items-center p-l-r-0'><figure class='avatar avatar-state-success mr-3'> <span class='avatar-title rounded-circle'>"+users[i].charAt(0)+"</span> </figure> <div> <h6 id='nameval' class='m-b-0'>"+ users[i] +"</h6> </div></li></a>");
        console.log(users[i]);


        
        $(document).on('click', '#val' ,function() {
           // debugger;
            $('#name').text('@' + $(this).text().slice(3));
            $('#receiverName').val($(this).text().slice(5).trim());
            $('#nameLink').attr("href","/profile/"+$(this).text().slice(5));
        });
       
        $('#numValue').text(users.length);
        $('#users').html(ol);
    }
    });

    socket.on('newMessage', function(data){
        var template = $('#message-template').html();
       // console.log(template);
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.from

        });
        //console.log(message);

        $("#message-item").append(message);

    });


    $('#message-form').on('submit', function(e){
        e.preventDefault();
        var msg = $('#msg').val();
        console.log(msg);

        socket.emit('createMessage', {
            text: msg,
            room: room,
            sender: sender
        }, function() {
            $('#msg').val('');
        });


        $.ajax({
            url: '/room/'+ room,
            type: 'POST',
            data: {
                message: msg,
                roomName: room
            },
            success: function(){
                $('#msg').val('');
            }
        })
    });
});

