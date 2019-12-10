const Seat = db.collection('seat')

router.get('/search_seat', function(req, res){
    console.log('search_seat 호출됨');
    console.log(req.body);

    var trip_pattern = req.body.trip_pattern;
    
})