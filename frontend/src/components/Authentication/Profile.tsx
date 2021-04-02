import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Select
} from '@chakra-ui/react';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import IntroContainer from '../VideoCall/VideoFrontend/components/IntroContainer/IntroContainer';

export default function Profile(): JSX.Element {
  const { myPlayerID, players } = useCoveyAppState();
  const myPlayer = players.find((player) => player.id === myPlayerID);
  const [ currentAvatar, setCurrentAvatar ] = useState<string>('misa');
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentAvatar(event.target.value)
  }

  return (
    <IntroContainer>
      <h1>Profile Page</h1>
      <h2>Current User Avatar</h2>
      <Image
        key={Date.now()}
        boxSize="100px"
        objectFit="contain"
        src={`${process.env.PUBLIC_URL}/assets/atlas/tuxemon-${currentAvatar}/${currentAvatar}-front.png`}
        alt="Tuxemon Misa"
      />
      <h2> Select Avatar from Dropdown</h2>
      <Select
        value={currentAvatar}
        onChange={handleChange} >
        <option value="misa">Tuxemon Misa </option>
        <option value="catgirl">Tuxemon Catgirl</option>
        <option value="female">Tuxemon Female </option>
        <option value="childactor">Tuxemon ChildActor</option>
        <option value="beachcomber">Tuxemon BeachComber </option>
      </Select>
      
    
      

    </IntroContainer>
  );
} 