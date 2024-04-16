import { getDailyReport, getMonthlyReport, getYearlyReport, getLocationReport, getDurationReport, getCoursesReport, insertQuestionNoDate, insertQuestionYesDate, insertHeadcount, checkLastHeadCount,  getCoursecodes} from '../models/database.js';

export const report_page = (async (req,res)=> {
  res.render("Reports.ejs")
})

export const daily_report = (async (req,res)=> {
    const userdate = req.query.date
    const reportDaily = await getDailyReport(userdate)
    res.render("Report-Preview-Daily.ejs",{reportDaily})
  })

export const monthly_report = (async (req,res)=> {
  const userdate = req.query.date
  const  cleanDate = userdate
  //let cleanDate = rawdate.slice(0,7)
  let cleanYear = cleanDate.substring(0,4)
  let cleanMonth = cleanDate.substring(5,7)
  const date = new Date(cleanYear,cleanMonth)
  const dateArray = []
  for(let i = 0; i < 6; i++)
    {   
      date.setMonth(date.getMonth()-1)
      let dateISO =(date.toISOString())
      let saveDate = dateISO.slice(0,7)
      dateArray.push(saveDate)
    }
    const reportMonthly = await getMonthlyReport(dateArray)
    console.log(Object.keys(reportMonthly[0]))
    let months = Object.keys(reportMonthly[0])
    console.log(Object.values(reportMonthly[0]))
    let monthValue = Object.values(reportMonthly[0])
    const monthlyNumbers = {months, monthValue}; 
    res.render("Report-Preview-Monthly.ejs",{monthlyNumbers})
  })

export const yearly_report = (async (req,res)=> {
    const userdate = req.query.date
    const targetYear = userdate
    let year = targetYear.slice(0,4)
    const reportYearly = await getYearlyReport(year)
    res.render("Report-Preview-Yearly.ejs",{reportYearly})
  })

export const location_report = (async (req,res)=> {
  const userdate = req.query.date
  const targetYear = userdate
  let year = targetYear.slice(0,4)
  const reportLocation = await getLocationReport(year)
    res.render("Report-Preview-Location.ejs", {reportLocation})
  })

export const duration_report = (async (req,res)=> {
  const userdate = req.query.date
  const targetYear = userdate
  let year = targetYear.slice(0,4)
  const reportDuration = await(getDurationReport(year))
    res.render("Report-Preview-Duration.ejs", {reportDuration})
  })

export const courses_report = (async (req,res)=> {
  const userdate = req.query.date
  const targetYear = userdate 
  let year = targetYear.slice(0,4)
  const reportCourses = await(getCoursesReport(year))
  const courses = []
  const questions = []
  Object.entries(reportCourses).forEach(([key]) =>{courses.push(reportCourses[key].courseCode), questions.push(reportCourses[key].numberOfQuestions)})
  console.log(courses)
  console.log(questions)
  res.render("Report-Preview-Courses.ejs",{courses,questions})
  })


  export const head_count = (async (req,res)=> {
    const headcount = parseInt(req.body.headcount)
    console.log(headcount)
    
    const result = await insertHeadcount(headcount, req.user.userID)
    console.log(result)
    let successMessage = "Count Submitted Successfully"
    res.render("Headcount.ejs",{successMessage})
    
  })

  export const head_count_page = (async (req,res)=> {
    
    res.render("Headcount.ejs")
    
  })

  export const insert_question = async (req, res) => {
    // This extract form data from the request...
    const categoryID = req.body.categorydrop;
    const locationID = req.body.locationdrop;
    const durationID = req.body.durationdrop;
    const courseID = req.body.coursecodedrop;
    const notes = req.body.notestext;
    const dateOfQuestion = req.body.date
    console.log(categoryID)
    console.log(locationID)
    console.log(durationID)
    console.log(courseID)
    console.log(notes)
    console.log(dateOfQuestion)
  
   
    try {
        // Use the appropriate function
        if (dateOfQuestion) {
            await insertQuestionYesDate(categoryID, locationID, durationID, courseID, notes, req.user.userID, dateOfQuestion + ' ' + req.body.time);
        } else {
            await insertQuestionNoDate(categoryID, locationID, durationID, courseID, notes, req.user.userID);
        }
        // Redirect the user back 
        const courseCodes = await getCoursecodes()
        res.render("Records.ejs", {courseCodes, message: 'Question Inserted Successfully' })
    } catch (error) {
        
        console.error('Error inserting question:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };