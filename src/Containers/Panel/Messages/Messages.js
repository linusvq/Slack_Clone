import { Component } from "react";
import MessagesComponent from "../../../Components/Messages";
import firebase from '../../../firebase'
import { connect } from "react-redux";

class Messages extends Component {
	state={
		message:'',
		msgLoading:false,
		messagesRef:firebase.database().ref('messages'),
		msgError:[]
	}

	setMessage=()=>{
		const massege={
			timestamp:firebase.database.ServerValue.TIMESTAMP,
			content:this.state.message,
			user:{
				id:this.props.user.uid,
				name:this.props.user.displayName,
				avatar:this.props.user.photoURL
			}
		};
		return massege;
	}

	sendMessage=()=>{
		const {message,messagesRef} =this.state;
		if (message) {
			this.setState({msgLoading:true})
			messagesRef
				.child(this.props.currentChannel.id)
				.push()
				.set(this.setMessage())
				.then(()=>{
					this.setState({msgLoading:false})
				})
				.catch(err=>{
					console.log(err);
					this.setState({msgLoading:false,msgError:this.state.connect(err)})
				})
		}
	}

	onMessageChange=e=>{
		this.setState({[e.target.name]:e.target.value})
	}

	render(){
		return(
			<MessagesComponent
			{...this.state}
			{...this.props}
			onMessageChange={this.onMessageChange}
			sendMessage={this.sendMessage}/>
		)
	}
}

const mapStateToProps=state=>{
	return{
		user:state.user.currentUser,
		currentChannel:state.channel.currentChannel
	}
}
export default connect(mapStateToProps)(Messages);