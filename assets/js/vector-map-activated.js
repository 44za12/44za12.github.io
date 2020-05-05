// jvector map
    $(function(){
        var plants = [
            {name: 'Bangladesh', coords: [23.684994, 90.356331], status: 'closed', offsets: [0, 2]},
            {name: 'India', coords: [20.593684, 78.96288], status: 'closed', offsets: [0, 2]},
            {name: 'Japan', coords: [36.204824, 138.252924], status: 'closed'},
            {name: 'Russia', coords: [61.52401, 105.318756], status: 'closed'},
            {name: 'Greenland', coords: [71.706936, -42.604303], status: 'activeUntil2018'},
            {name: 'United States', coords: [36.778259, -119.417931], status: 'closed'},
            {name: 'Brazil', coords: [-14.235004, -51.92528], status: 'closed', offsets: [0, -2]},
            {name: 'Libya', coords: [26.3351, 17.228331], status: 'closed', offsets: [0, -2]}
        ];
      
        new jvm.Map({
            container: $('#world-map-gdp'),
            map: 'world_mill',
            markers: plants.map(function(h){ return {name: h.name, latLng: h.coords} }),
            labels: {
                markers: {
                    render: function(index){
                    // return plants[index].name;
                    },
                    offsets: function(index){
                    var offset = plants[index]['offsets'] || [0, 0];
        
                    return [offset[0] - 7, offset[1] + 3];
                    }
                }
            },
            series: {
                markers: [{
                attribute: 'image',
                scale: {
                    'closed': 'assets/img/svg/dist-icon-4.png',
                    'activeUntil2018': 'assets/img/svg/dist-icon-4.png',
                    'activeUntil2022': 'assets/img/svg/dist-icon-4.png'
                },
                values: plants.reduce(function(p, c, i){ p[i] = c.status; return p }, {})
                }]
            }
            
        });
      });