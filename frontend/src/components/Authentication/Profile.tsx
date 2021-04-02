import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Heading,  
  Image,
  Select,
  Stack
} from '@chakra-ui/react';
import { BsFillInfoCircleFill } from 'react-icons/bs'
import useCoveyAppState from '../../hooks/useCoveyAppState';
import IntroContainer from '../VideoCall/VideoFrontend/components/IntroContainer/IntroContainer';

export default function Profile(): JSX.Element {
  const { myPlayerID, players } = useCoveyAppState();
  const myPlayer = players.find((player) => player.id === myPlayerID);
  const [ currentAvatar, setCurrentAvatar ] = useState<string>(myPlayer?.currentAvatar || 'misa');
  const [ avatarPreview, setAvatarPreview ] = useState<string>('misa');
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAvatarPreview(event.target.value)
  }

  const handleSave = () => {
    // Todo: add logic
  }

  return (
    <IntroContainer>
      
      <Stack>
        <Box p="4" borderWidth="1px" borderRadius="lg">
          <Center h="50px">
            <Heading as="h1" size="lg">Profile Page</Heading>
          </Center>    
        </Box>
        <Box p="4" borderWidth="1px" borderRadius="lg">
          <Center>
            <Heading as="h2" size="md">Current User Avatar</Heading>
          </Center>   
        
          <Center>
            <Image
              boxSize="100px"
              objectFit="contain"
              src={`${process.env.PUBLIC_URL}/assets/atlas/tuxemon-${currentAvatar}/${currentAvatar}-front.png`}
            />
          </Center>
        </Box>
        <Box p="4" borderWidth="1px" borderRadius="lg">
          <h2> <BsFillInfoCircleFill/>To change the current Avatar, select one from the Dropdown Menu</h2> 
        </Box>
        <Box p="4" borderWidth="1px" borderRadius="lg">
          <Center>
            <Heading as="h2" size="sm">Selection Preview</Heading>
          </Center>   
        
          <Center>
            <Image
              key={Date.now()}
              boxSize="100px"
              objectFit="contain"
              src={`${process.env.PUBLIC_URL}/assets/atlas/tuxemon-${avatarPreview}/${avatarPreview}-front.png`}
            />
          </Center>
        </Box>
        <Stack direction="row">
          <Select
            value={currentAvatar}
            onChange={handleChange} >
            <option value="misa">Tuxemon Misa </option>
            <option value="catgirl">Tuxemon Catgirl</option>
            <option value="female">Tuxemon Spooky </option>
            <option value="childactor">Tuxemon ChildActor</option>
            <option value="beachcomber">Tuxemon BeachComber </option>
          </Select>
          <Button colorScheme="blue" onClick={handleSave}> Save </Button>
        </Stack>
        
      </Stack>
    </IntroContainer>
  );
} 