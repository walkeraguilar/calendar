var CALENDAR = function () { 
    var wrap, label,  
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
            
	var startdate, numberdays, countrycode, selected_date_pieces, month_selected;
	
    function init(newWrap) { 
		
		startdate = $('#startdate').val();
		numberdays = $('#numberdays').val();
		countrycode = $('#countrycode').val();
		
		selected_date_pieces = startdate.split('-');
		month_selected = selected_date_pieces[1];
		
		wrap = $(newWrap || "#cal"); 
		label = wrap.find("#label"); 
		wrap.find("#prev").bind("click.calendar", function () { switchMonth(false); }); 
		wrap.find("#next").bind("click.calendar", function () { switchMonth(true);  }); 
		label.bind("click", function () { switchMonth(null, new Date().getMonth(), new Date().getFullYear()); });        
		label.click();
    } 

    function switchMonth(next, month, year) { 
		
		var curr = label.text().trim().split(" "), calendar, tempYear =  parseInt(curr[1], 10);
		
		if (!month) { 
		    if (next) { 
		        if (curr[0] === "December") { 
		            month = 0; 
		        } else { 
		            month = months.indexOf(curr[0]) + 1; 
		        } 
		    } else { 
		        if (curr[0] === "January") { 
		            month = 11; 
		        } else { 
		            month = months.indexOf(curr[0]) - 1; 
		        } 
		    } 
		}
		
		if (!year) { 
		    if (next && month === 0) { 
		        year = tempYear + 1; 
		    } else if (!next && month === 11) { 
		        year = tempYear - 1; 
		    } else { 
		        year = tempYear; 
		    } 
		}
		
		console.log('startdate: ' + startdate);
				
		calendar =  createCal(year, month, startdate, numberdays, countrycode); 
		
        $("#cal-frame", wrap) 
            .find(".curr") 
                .removeClass("curr") 
                .addClass("temp") 
            .end() 
            .prepend(calendar.calendar()) 
            .find(".temp") 
                .fadeOut("slow", function () { $(this).remove(); }); 

        $('#label').text(calendar.label); 
    } 
	
    function createCal(year, month, startdate, numberdays, countrycode) { 
		
		console.log(year);
		
		console.log(month);
		
		var day = 1, i, j, haveDays = true,  
	    	startDay = new Date(year, month, day).getDay(), 
	    	daysInMonths = [31, (((year%4==0)&&(year%100!=0))||(year%400==0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], 
	    	calendar = [];
	    	
	    if (createCal.cache[year]) { 
		    if (createCal.cache[year][month]) { 
		        return createCal.cache[year][month]; 
		    } 
		} else { 
		    createCal.cache[year] = {}; 
		}
		
		i = 0; 
		while (haveDays) { 
		    calendar[i] = []; 
		    for (j = 0; j < 7; j++) { 
		        if (i === 0) { 
		            if (j === startDay) { 
		                calendar[i][j] = day++; 
		                startDay++; 
		            } 
		        } else if (day <= daysInMonths[month]) { 
		            calendar[i][j] = day++; 
		        } else { 
		            calendar[i][j] = ""; 
		            haveDays = false; 
		        } 
		        if (day > daysInMonths[month]) { 
		            haveDays = false; 
		        } 
		    } 
		    i++; 
		}
	
		if (calendar[5]) { 
		    for (i = 0; i < calendar[5].length; i++) { 
		        if (calendar[5][i] !== "") { 
		            calendar[4][i] = "<span>" + calendar[4][i] + "</span><span>" + calendar[5][i] + "</span>"; 
		        } 
		    } 
		    calendar = calendar.slice(0, 5); 
		}
		
		console.log('Calendar Draw');
		//console.log('Calendar: ' + calendar);
		//console.log(calendar);
		//console.log(calendar.length);
		
		var calendar_row = "";
		
		for (i = 0; i < calendar.length; i++) { 
			
			calendar_row = "";
			
			for(j = 0; j < calendar[i].length ; j++) {
				
				//console.log(calendar[i][j] + "-" + month + "-" + year);	
				
				var month_fixed = month + 1;
				
				var month_day = new Date(year + "-" + month_fixed + "-" + calendar[i][j]);
				var start_date = new Date(startdate);
				
				//console.log('Month Day: ' + month_day + ' - Start Date: ' + start_date);
				
				if(calendar[i][j] === undefined || calendar[i][j] === null) {
     				
     				calendar_row += "<td>&nbsp;</td>";
     					
				}else{
					
					if (month_day.getTime() >= start_date.getTime() && numberdays > 0) {
							
						calendar_row += "<td>" + calendar[i][j] + "</td>";
						
						numberdays --;
						
					}else{
						
						calendar_row += "<td>&nbsp;</td>";
					}
				}
				
				
			}
			
		    calendar[i] = "<tr>" + calendar_row + "</tr>"; 
		}
		 
		calendar = $("<table>" + calendar.join("") + "</table>").addClass("curr"); 
	 
		$("td:empty", calendar).addClass("nil"); 
		
		if (month === new Date().getMonth()) { 
		
		    $('td', calendar).filter(function () { return $(this).text() === new Date().getDate().toString(); }).addClass("today"); 
		}
		 
		createCal.cache[year][month] = { calendar : function () { return calendar.clone() }, label : months[month] + " " + year }; 
	 
		return createCal.cache[year][month];
    } 
    
    createCal.cache = {}; 
    return { 
        init : init, 
        switchMonth : switchMonth, 
        createCal   : createCal 
    }; 
};

