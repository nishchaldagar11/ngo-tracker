import { useEffect, useState } from "react";
import API from "../../services/api";

export default function DashboardTracker(){

const [events,setEvents] = useState([]);

useEffect(()=>{

fetchEvents();

},[]);

const fetchEvents = async()=>{

try{

const res = await API.get("/events?program=Achal Collective");

setEvents(res.data);

}catch(err){

console.log(err);

}

};

return(

<div className="p-6">

<h1 className="text-2xl font-bold mb-6">Dashboard Events</h1>

{events.map((event)=> (

<div key={event._id} className="border p-4 mb-3 rounded">

<h3 className="font-semibold">{event.name}</h3>

<p>{event.location}</p>

<p>{new Date(event.date).toLocaleDateString()}</p>

<p className="text-green-600">
Attendance: {event.attendanceCount}
</p>

</div>

))}

</div>

);

}