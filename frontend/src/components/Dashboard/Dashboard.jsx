
import './Dashboard.css';

import DisplayInfoForm from '../DisplayInfo';
import DashboardGrid from './DashboardGrid';
import ExternalLinksForm from '../ExternalLinksForm';

export default function Dashboard() {


   return (
      <div id="dashboard-container">
         <div className='page-title-content'>
            <div className="page-title-container">
               <p>Dashboard</p>
            </div>
         </div>
         <div className='dashboard-row-layout'>
            <DashboardGrid />
            <ExternalLinksForm />
         </div>
         <div>
            <DisplayInfoForm />
         </div>
      </div>
   )
}
