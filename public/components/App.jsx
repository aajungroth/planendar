import React from 'react';
import Navbar from './Navbar.jsx';
import Weekview from './Weekview.jsx';
import Calendar from './Calendar.jsx';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      newReminders: [],
      reminderInput: {
        minutes: ''
      },
      appointmentInput: {
        description: '',
        end_date: '',
        end_date_time: '',
        location: '',
        start_date: '',
        start_date_time: '',
        title: ''
      },
      events: []

    };
    this.createNewReminder = this.createNewReminder.bind(this);
    this.deleteNewReminder = this.deleteNewReminder.bind(this);
    this.createNewAppointment = this.createNewAppointment.bind(this);
    this.updateNewReminder = this.updateNewReminder.bind(this);
    this.updateNewAppointment = this.updateNewAppointment.bind(this);
  }

  createNewReminder() {
    //console.log('createNewReminder');
    this.setState((prevState) => {
      var minutes = parseInt(prevState.reminderInput.minutes, 10);
      prevState.newReminders.push(minutes);
      prevState.reminderInput.minutes = '';
      return {newReminders: prevState.newReminders,
        reminderInput: prevState.reminderInput};
    });
  }

  deleteNewReminder(key) {
    //console.log('deleteNewReminder');
    this.setState((prevState) => {
      //console.log(key);
      prevState.newReminders.splice(key, 1);
      return {newReminders: prevState.newReminders};
    });
  }

  createNewAppointment() {
    //console.log('createNewAppointment');
    //console.log(this.state.appointmentInput);
    var newAppointmentData = Object.assign({}, this.state.appointmentInput);
    newAppointmentData.reminders = this.state.newReminders;
    //console.log('newAppointmentData', newAppointmentData);
    $.ajax({
      url: '/schedule',
      type: 'POST',
      data: newAppointmentData,
      dataType: 'json',
      success: function(response) {
        //console.log('success', response);
        this.setState({
          newReminders: [],
          reminderInput: {
            minutes: ''
          },
          appointmentInput: {
            description: '',
            end_date: '',
            end_date_time: '',
            location: '',
            start_date: '',
            start_date_time: '',
            title: ''
          }
        });
      }.bind(this),
      error: function(err) {
        console.error(err);
      }.bind(this)
    })
  }

  updateNewReminder(key, value) {
    //console.log('updateNewReminder');
    this.setState((prevState) => {
      prevState.reminderInput[key] = value;
      return {
        reminderInput: prevState.reminderInput
      }
    });
  }

  updateNewAppointment(key, value) {
    //console.log('updateNewAppointment');
    this.setState((prevState) => {
      prevState.appointmentInput[key] = value;
      return {
        appointmentInput: prevState.appointmentInput
      }
    });
  }


  mergeDateTime(date, dateTime) {
    let dateSplit = date.split('-');
    let dateTimeSplit = dateTime.split(':');

    return new Date(dateSplit[0], dateSplit[1], dateSplit[2], dateTimeSplit[0], dateTimeSplit[1]);
  }

  getAppointments() {
    $.ajax({
      type: 'GET',
      url: '/schedule',
      success: function(appointments) {
        console.log(appointments)
        let events = [];
        appointments.map((appointment, i) => {
          start = this.mergeDateTime(appointment.startDate, appointment.startDateTime);
          end = this.mergeDateTime(appointment.endDate, appointment.endDateTime);
          events[i] = {
            title: appointment.title,
            start: start,
            end: end
          }
        })

        this.setState({events: events})

      }.bind(this),
      error: function(err) {
        console.error('Error in getting appointments', error);
      }.bind(this)
    });
  }

  componentDidMount() {
    this.getAppointments()
  }

  render() {
    return(
      <div>
        <Navbar
         reminders={this.state.newReminders}
         reminderInput={this.state.reminderInput}
         appointmentInput={this.state.appointmentInput}
         createReminder={this.createNewReminder}
         deleteReminder={this.deleteNewReminder}
         createAppointment={this.createNewAppointment}
         updateReminder={this.updateNewReminder}
         updateAppointment={this.updateNewAppointment}></Navbar>

        <Calendar events={this.state.events}/>

      </div>
    );
  }
}


/*
<Weekview></Weekview>
*/


