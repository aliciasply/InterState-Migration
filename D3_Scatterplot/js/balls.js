let animation = anime.timeline({
    duration: 1000, 
    easing: 'easeInOutSine',  
    loop: true
      });           
        
    animation.add({
        targets: '.one',
        keyframes: [
        {translateY: -70, backgroundColor: 'rgb(0, 255, 0)' },
        {translateY: 0, backgroundColor: 'rgb(128, 128, 128)'}   
        ]
    }).add({
        targets: '.two',
        keyframes: [
            {translateY: -70, backgroundColor: 'rgb(0, 0, 255)' },
            {translateY: 0, backgroundColor: 'rgb(128, 128, 128)'}
        ]
    }, '-=900').add({
        targets: '.three',
        keyframes: [
        {translateY: -70, backgroundColor: 'rgb(255, 0, 0)' },
        {translateY: 0, backgroundColor: 'rgb(128, 128, 128)'}
          
        ]
      }, '-=800');