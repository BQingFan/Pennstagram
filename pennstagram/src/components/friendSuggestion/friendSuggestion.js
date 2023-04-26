/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { updateUserInfo, getUserById } from '../../mockAPI/mockAPI';
import './friendSuggestion.css';

export default function FriendSuggestion(props) {
  const userId = localStorage.getItem('myUserID');
  const [isFollowed, setIsFollowed] = useState(false);
  const currentUser = useRef({});
  const { friend } = props;

  useEffect(() => {
    async function fetchCurrentUser(id) {
      const data = await getUserById(id);
      currentUser.current = data;
    }
    fetchCurrentUser(userId);
  }, []);

  const handleFollow = async (friendInfo) => {
    // user1 add recId to his followers (call apis)
    currentUser.current.followers.push(friendInfo._id);
    await updateUserInfo(currentUser.current._id, currentUser.current);
    // await updateRecInfo(currentUser.current._id, currentUser.current);
    // user2 add user1_id to his followees
    friendInfo.followees.push(userId);
    await updateUserInfo(friendInfo._id, friendInfo);
    // await updateRecInfo(friend._id, friend);
    setIsFollowed(true);
  };

  const handleUnfollow = async (friendInfo) => {
    // remove follower
    const indexOfFollower = currentUser.current.followers.indexOf(friendInfo._id);
    currentUser.current.followers.splice(indexOfFollower, 1);
    await updateUserInfo(currentUser.current._id, currentUser.current);
    // await updateRecInfo(currentUser.current._id, currentUser.current);
    // remove followee
    const indexOfFollowee = friendInfo.followees.indexOf(currentUser.current._id);
    friendInfo.followees.splice(indexOfFollowee, 1);
    await updateUserInfo(friendInfo._id, friendInfo);
    // await updateRecInfo(friend._id, friend);
    setIsFollowed(false);
  };

  return (
    <div className="newFriend">
      <Link style={{ textDecoration: 'none' }} to={`/profile/${friend._id}`} role="presentation">
        <div className="nameAvatar">
          <img className="avatar1" src={friend.profilePic} alt="avatar" />
          <h4 className="name1" style={{ color: 'black' }}>{friend.name}</h4>
        </div>
      </Link>
      <div className="followButton">
        {
          isFollowed ? (
            <button className="Unfollow" type="button" data-testid="FBtn" onClick={() => handleUnfollow(friend)}>Unfollow</button>
          ) : (
            <button className="Follow" type="button" data-testid="FBtn" onClick={() => handleFollow(friend)}>Follow</button>
          )
        }
      </div>
    </div>
  );
}
// avoid add same person to following list
// let the suggestion list don't appear the friend I add (delete request to unfollow api)
// should consider the mutually exclusive between the followingArray and suggestionArray
// }
