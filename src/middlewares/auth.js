const saltrounds=10;
    bcrypt.hash(password, saltrounds ,function(err, hash){
        if(hash) userData.password=hash;
        else return res.status(400).send({status:false, message:"please send another password"})
    })

    bcrypt.compare(password, isUserExist.password, function(err, matched){
        if(err) return res.status(400).send({status:false, message:"Please enter valid password"})
      })