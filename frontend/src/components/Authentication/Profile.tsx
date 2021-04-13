import React, { useCallback, useState } from 'react';
import assert from "assert";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,  
  Image,
  Input,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast
} from '@chakra-ui/react';
import { BsFillInfoCircleFill } from 'react-icons/bs'
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles, Theme } from '@material-ui/core';
import useVideoContext from '../VideoCall/VideoFrontend/hooks/useVideoContext/useVideoContext';
import Video from '../../classes/Video/Video';
import { CoveyTownInfo, TownJoinResponse, } from '../../classes/TownsServiceClient';
import IntroContainer from '../VideoCall/VideoFrontend/components/IntroContainer/IntroContainer';
import BackHomeButton from './BackHomeButton';

const useStyles = makeStyles((theme: Theme) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: '30px',
  },

  bodyDiv: {
    backgroundColor: '#87ceff',
    height: '100vh',
  }
}));

interface ProfileProps {
  doLogin: (initData: TownJoinResponse) => Promise<boolean>
}

export default function Profile({ doLogin }: ProfileProps): JSX.Element {

  const [ currentAvatarPreview, setCurrentAvatarPreview ] = useState<string>('misa');
  const { buttonContainer, bodyDiv } = useStyles();

  // const { myPlayerID, players } = useCoveyAppState();
  // const myPlayer = players.find((player) => player.id === myPlayerID);
  // const [ currentAvatar, setCurrentAvatar ] = useState<string>(myPlayer?.currentAvatar || 'misa');
  const [ avatarPreview, setAvatarPreview ] = useState<string>('misa');
  const { user } = useAuth0();
  const [userName] = useState<string>(user.given_name  || user.nickname);
  const { connect } = useVideoContext();

  const [ firstName, setFirstName ] = useState<string>('placeholder for firstName');
  const [ lastName, setLastName ] = useState<string>('placeholder for lastName');
  const [ email ] = useState<string>('placeholder for email');

  // if (isAuthenticated) {
  //   setUserName();
  // }
  // TODO: getSavedTownsFromDataBase()
  const currentlySavedTowns: CoveyTownInfo[] = [];
  const toast = useToast();

  const handleJoin = useCallback(async (coveyRoomID: string) => {
    try {
      if (!userName || userName.length === 0) {
        toast({
          title: 'Unable to join town',
          description: 'Please select a username',
          status: 'error',
        });
        return;
      }
      if (!coveyRoomID || coveyRoomID.length === 0) {
        toast({
          title: 'Unable to join town',
          description: 'Please enter a town ID',
          status: 'error',
        });
        return;
      }
      const initData = await Video.setup(userName, coveyRoomID);

      const loggedIn = await doLogin(initData);
      if (loggedIn) {
        assert(initData.providerVideoToken);
        await connect(initData.providerVideoToken);
      }
    } catch (err) {
      toast({
        title: 'Unable to connect to Towns Service',
        description: err.toString(),
        status: 'error'
      })
    }
  }, [doLogin, userName, connect, toast]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAvatarPreview(event.target.value);
  };


  const handleSave = () => {
    setCurrentAvatarPreview(avatarPreview);  
    // TODO: Add Database function
  };

  const processUpdates = async (action: string) =>{
    if (action === 'edit'){
      // TODO: Add Database function
    }
  }
  
  return (
    <div className={bodyDiv}>
    <IntroContainer>
            <div className={buttonContainer}>
        <BackHomeButton />
      </div>
      <Stack>
        <Center h="50px">
          <Heading as="h1" size="lg">Profile Page</Heading>
        </Center>   
        <Box p="4" borderWidth="1px" borderRadius="lg">
          <Center>
            <Heading as="h2" size="md">User Infomation</Heading>
          </Center>
          <Box p="4" borderWidth="1px" borderRadius="lg">
            <form onSubmit={(ev)=>{ev.preventDefault(); processUpdates('edit')}}>
              <Stack>
                <Input id='email' name="email" value={email} disabled />
                <Stack align='center' direction='row'>
                  <FormControl>
                    <FormLabel htmlFor='firstName'>First Name</FormLabel>
                    <Input id='firstName' placeholder="First Name" name="firstName" value={firstName} onChange={(ev)=>setFirstName(ev.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor='lastName'>Last Name</FormLabel>
                    <Input id='lastName' placeholder="Last Name" name="lastName" value={lastName} onChange={(ev)=>setLastName(ev.target.value)} />
                  </FormControl>
                  <Button data-testid='updatebutton' colorScheme="blue" value="update" name='action2' onClick={()=>processUpdates('edit')}>
                  Update
                  </Button>
                </Stack>
              </Stack>  
            </form>
          </Box>
          
        </Box> 
        <Box p="4" borderWidth="1px" borderRadius="lg">
          <Center>
            <Heading as="h2" size="md">Current User Avatar</Heading>
          </Center>   
        
          <Center>
            <Image
              boxSize="100px"
              objectFit="contain"
              src={`${process.env.PUBLIC_URL}/assets/atlas/tuxemon-${currentAvatarPreview}/${currentAvatarPreview}-front.png`}
            />
          </Center>
        </Box>
        <Box p="4" borderWidth="1px" borderRadius="lg">
          <Stack align='center' direction="row">
            <BsFillInfoCircleFill/> <Text fontSize="lg">To change the current Avatar, select one from the Dropdown Menu </Text>
          </Stack>
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
          <Select variant="filled" onChange={handleChange}>
            <option value="misa">Misa </option>
            <option value="catgirl">Catgirl</option>
            <option value="female">Spooky </option>
            <option value="childactor">ChildActor</option>
            <option value="beachcomber">BeachComber </option>
          </Select>
          <Button colorScheme="blue" onClick={handleSave}> Save </Button>
        </Stack>
        
        <Heading p="4" as="h4" size="md">Saved Towns</Heading>
            <Box maxH="500px" overflowY="scroll">
              <Table>
                <Thead><Tr><Th>Town Name</Th><Th>Town ID</Th><Th>Town Type</Th><Th>Activity</Th></Tr></Thead>
                <Tbody>
                  {currentlySavedTowns?.map((town) => (
                    <Tr key={town.coveyTownID}><Td role='cell'>{town.friendlyName}</Td><Td
                      role='cell'>{town.coveyTownID}</Td>
                      <Td role='cell'>Public/Private</Td>
                      <Td role='cell'>{town.currentOccupancy}/{town.maximumOccupancy}
                        <Button onClick={() => handleJoin(town.coveyTownID)}
                                disabled={town.currentOccupancy >= town.maximumOccupancy}>Connect</Button></Td></Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
            <Button data-testid='deletebutton' colorScheme="red" mr={3} value="delete" name='action1' >
              Delete Account
            </Button>
      </Stack>
    </IntroContainer>
    </div>
  );
} 

