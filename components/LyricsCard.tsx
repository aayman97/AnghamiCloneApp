import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';



type props = {
    item : LyricsObject,
    position : number,
    index : number,
    lyrics : LyricsObject[]
}


const LyricsCard = ({item,position,index,lyrics} : props) =>{


//     const [storeMinValue,setStoreMinValue] = useState<number|null>()

//     const syncWithLyrics = () =>{
//         if(storeMinValue){
//         if(position > storeMinValue && position < lyrics[index+1]?.timestamp){
//             return index
//         }else if(!lyrics[index+1]){
//             return lyrics.length-1
//         }else if(!lyrics[index-1]){
//             return 0
//         }
        
//         }
        
       
//     }

// useEffect(()=>{
//     if(parseInt(Math.floor(position).toString(), 10) === lyrics[index].timestamp || parseInt(Math.floor(position).toString(), 10) < lyrics[index+1]?.timestamp){
//         setStoreMinValue(lyrics[index].timestamp)
//     }
// },[position])
   
 
    
    return(
        <TouchableOpacity style={styles.verseContainer}>
        <Text style={[styles.verseStyle,{color : true ? 'white' : 'black' }]}>
          {item.lyrics}
      </Text>
      </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    verseContainer : {
        marginTop : 20
      },
      verseStyle : {
        // color :  "white",
        fontWeight : 'bold',
        fontSize : 30
      }
})

export default React.memo(LyricsCard)