import express from 'express';
import { daily_report, monthly_report, yearly_report, location_report, duration_report, courses_report, head_count, insert_question, report_page} from '../controllers/reportControl.js'
export const routerReport = express.Router()
import { isAuthenticated } from '../middleware/authMiddleware.js';
import{checkPermission} from '../middleware/rbacMiddleware.js';

routerReport.get('/getReportpage', isAuthenticated,checkPermission("reports"), report_page)
routerReport.get('/getDaily', isAuthenticated,checkPermission("reports"), daily_report)
routerReport.get('/getMonthly', isAuthenticated, checkPermission("reports"), monthly_report)
routerReport.get('/getYearly', isAuthenticated,checkPermission("reports"), yearly_report)
routerReport.get('/getLocation', isAuthenticated,checkPermission("reports"),  location_report)
routerReport.get('/getDuration', isAuthenticated,checkPermission("reports"),  duration_report)
routerReport.get('/getCourses', isAuthenticated,checkPermission("reports"),  courses_report)
routerReport.post('/insertHeadcount', isAuthenticated, head_count)
routerReport.post('/insert-question', isAuthenticated, insert_question);