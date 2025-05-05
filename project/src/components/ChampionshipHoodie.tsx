import React from 'react';
import { Box, Image, Text, Button, Flex } from '@chakra-ui/react';

const ChampionshipHoodie: React.FC = () => {
  const handleShopNow = () => {
    window.open('https://furia.gg/loja', '_blank');
  };

  return (
    <Flex direction="column" align="center" gap={4} p={4}>
      <Box
        boxSize="300px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="lg"
      >
        <Image
          src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
          alt="FURIA Championship Hoodie"
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Box>
      <Text fontSize="xl" fontWeight="bold" color="white">
        FURIA Championship Hoodie
      </Text>
      <Text color="gray.300" textAlign="center">
        Limited edition hoodie celebrating FURIA's championship victories
      </Text>
      <Button
        onClick={handleShopNow}
        colorScheme="amber"
        size="lg"
        width="full"
        maxW="200px"
        _hover={{ bg: 'amber.600' }}
      >
        Shop Now
      </Button>
    </Flex>
  );
};

export default ChampionshipHoodie; 