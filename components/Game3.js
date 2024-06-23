import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert,Text } from 'react-native';
import FastImage from 'react-native-fast-image';

const generateProblem = () => {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  return { num1, num2, answer: num1 + num2 };
};

const AdditionGame = () => {
  const [problem, setProblem] = useState(generateProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    setProblem(generateProblem());
  }, []);

  const handleSubmit = () => {
    if (parseInt(userAnswer) === problem.answer) {
      Alert.alert('Correct!', 'Bonne réponse!', [{ text: 'OK', onPress: () => nextProblem() }]);
      setScore(score + 1);
    } else {
      Alert.alert('Incorrect!', 'Réessayez.', [{ text: 'OK', onPress: () => setUserAnswer('') }]);
    }
  };

  const nextProblem = () => {
    setProblem(generateProblem());
    setUserAnswer('');
  };

  const renderNumberImage = (num) => {
    const numString = num.toString();
    return numString.split('').map((digit, index) => (
      <FastImage
        key={index}
        source={require(`./assets/images/character.gif`)} //   source={require(`./path/to/numbers/${digit}.png`)}

        style={styles.numberImage} 
      />
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jeu d'Addition</Text>
      <View style={styles.problemContainer}>
        {renderNumberImage(problem.num1)}
        <FastImage source={require('./assets/images/character.gif')} style={styles.numberImage} />
        {renderNumberImage(problem.num2)}
        <FastImage source={require('./assets/images/character.gif')} style={styles.numberImage} />
        <FastImage source={require('./assets/images/character.gif')} style={styles.numberImage} />
      </View>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={userAnswer}
        onChangeText={setUserAnswer}
        placeholder="Votre réponse"
      />
      <Button title="Valider" onPress={handleSubmit} />
      <Text style={styles.score}>Score: {score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
  },
  problemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  numberImage: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%',
    marginBottom: 20,
    borderRadius: 5,
    textAlign: 'center',
  },
  score: {
    marginTop: 20,
    fontSize: 24,
  },
});

export default AdditionGame;
