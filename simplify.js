  let defaultContext = {
    repeatingContext: "",  repeatingContextHeight: "1em",
    previousPrompts:  "",  previousPromptsHeight:  "2em",
    sourceText:       "",  sourceTextHeight:       "6em",
    thisChunk:        "",  thisChunkHeight:        "4em",
    simpleChunk:      "",  simpleChunkHeight:      "4em",
    target:           "",  targetHeight:           "8em",
    chunkSize:        500,
    chunkSeparator:   " ",
    chunkCount:       0,
    model:            "gpt=3.5-turbo",
    endpoint:         "",
    isMarkChunk:      true,
    bufferTitle1:     "",
    bufferTitle2:     "",
    bufferTitle3:     "",
    bufferTitle4:     "",
    bufferTitle5:     "",
    bufferTitle6:     "",
    buffers:          0,
    buffer1:          "",  buffer1Height: "6em",
    buffer2:          "",  buffer2Height: "6em",
    buffer3:          "",  buffer3Height: "6em",
    buffer4:          "",  buffer4Height: "6em",
    buffer5:          "",  buffer5Height: "6em",
    buffer6:          "",  buffer6Height: "6em"
  }
  
/*
  let models = [ 
   { "chat", "gpt-4" },
     { "chat", "gpt-4-0613" },
     { "chat", "gpt-4-32k" },
     { "chat", "gpt-4-32k-0613" },
     { "chat", "gpt-3.5-turbo" },
     { "chat", "gpt-3.5-turbo-0613" },
     { "chat", "gpt-3.5-turbo-16k" },
     { "chat", "gpt-3.5-turbo-16k-0613 " },
     { ""    , "text-davinci-003" },
     { ""    , "text-davinci-002" },
     { ""    , "text-davinci-001" },
     { ""    , "text-curie-001" },
     { ""    , "text-babbage-001" },
     { ""    , "text-ada-001" },
     { ""    , "davinci" },
     { ""    , "curie" },
     { ""    , "babbage" },
     { ""    , "ada" },
  ];
*/  

  let machineState = "";
  let started = false; 
  let context = {};
  let candidate  = "";
  
/*  
  function cancel() {  // Stop simplification at end of this chunk
    markState( "Cancelling" );
    isCancel = true;
  }
*/  
  
  function cancel() {                                /** Stop processing and prepare to restart */                           
    started = false;
    markState( "Canceling" );
    startStop( "", "play pause next redo cancel" )
  }
  
  function clearChunks( string ) {
    var list = string.split( " " );

    for( var itm in list ) {
      $( "#" + list[ itm ] ).val( "" );
    }
  }

  $( document ).ready( function() {                  /** Things that cannot happen until document is fully loaded */ 
    dragElement( document.getElementById( "help" ) );
    init();
  } );

  function getContext() {                            /** Retrieve variables from localstorage */    
    context = defaultContext;
    dbRead( 'settings', '', '' );
    let contextString = localStorage.getItem( "openAiContext" );
    
    if( contextString ) {
      const storedContext = JSON.parse( contextString );
      
      for( var attr in storedContext ) {  // copy from saved context to current context. hint saved may not have all current values
        if( storedContext.hasOwnProperty( attr ) ) {
          context[ attr ] = storedContext[ attr ];
        }
      }

      for( var attr in context ) {  // Copy from current context to form  
        if( context.hasOwnProperty( attr ) && ( attr.indexOf( "Height" ) < 0 ) ) {      
          switch( attr ) {
            case "chunkSizeValue":
              document.getElementById( attr ).innerText = context.chunkSize;
              break;
            
            case "isMarkChunk":  
              document.getElementById( "isMarkChunk" ).checked   = context.isMarkChunk;
              break;
            
            case "chunkSize":
            case "chunkCount":
            case "isMarkChunks":
            case "model":
              break;
          
            case "previousPrompts": // These have height attributes that may change
            case "repeatingContext":
            case "sourceText":
            case "thisChunk":
            case "simpleChunk":
            case "target":
            case "buffer1":
            case "buffer2":
            case "buffer3":
            case "buffer4":
            case "buffer5":
            case "buffer6":
              var obj = document.getElementById( attr );
              obj.value = context[ attr ];
              obj.style.height = context[ attr + "Height" ];               
              break;
              
            default:
              if( context[ attr ] ) {
                console.log( attr );
                document.getElementById( attr ).value = context[ attr ];
              }
          }
        }
      }      
    }
  }

  function hide( id ) {
    toggle( id );
    context.buffers -= 1;
    
    if( context.buffers < 7 ) {
      $( "#newBuffers" ).show();
    }
  }

  function init() {
    initDb( 'simplify', 'context' );
    getContext();
    markState( "Initializing" );
    markState( "Idling" );
    startStop( "play next", "pause redo cancel" );
  }
  
  function markState( txt ) {                        /** Set overall machine state to control action buttons */
    machineState = txt;
    toast( txt, "Progress" );
//    $( "#chatError" ).text( txt + "..." );
    console.log( "Changed machineState to: "+ txt ); 
  }
  
  function newBuffer() {                             /** Add a buffer to list */
    context.buffers += 1;

    if( context.buffers < 7 ) {
      $( "#b" + context.buffers ).show();
      $( "#newBuffers" ).show();
    } else {
      $( "#newBuffers" ).hide();
    }
  }

  function next() {                                  /** resume processing next chunk */
    markState( "Stepping" );
    
    if( ! started ) {
      simplify();    
    }

    startStop( "cancel", "play pause redo next" );
  }
   
  function pause() {                                 /** interrupt simplification */
    markState( "Pausing" );
    startStop( "cancel", "play pause next redo" );
  }
  
  function play() {                                  /** start or resume simplification */
    markState( "Playing" );

    if( ! started ) {
      simplify();
    }
      
    startStop( "pause cancel", "play redo next" );
  }
  
  function redo() {                                  /** reprocess current chunk */                          
    markState( "Redoing" );
    document.getElementById( "simpleChunk" ).value = "";    
    startStop( "next pause cancel", "play" );
  }
   
  function saveContext( attr, val ) {                /** Save all persistant variables in localstorage */    
    markState( "Saving" );

    if( attr ) {
      switch( attr ) {  
        case "chunkSize":
          document.getElementById( "chunkSizeValue" ).innerText = val; // this is a span
          break;
          
        case "model":
          break;

        default:
          document.getElementById( attr ).value = val; // normal context attributes
      }
      
      scanSizes();
      context[ attr ] = val;
      localStorage.setItem( "openAiContext", JSON.stringify( context ) );
      markState( "Saved" );
    }
  }
        
  function scanSizes() {                             /** Look for resized textareas and save them context */    
    $( '.resizable' ).each( function( id ) {
      var ta = this[ 'id' ];
      var h = document.getElementById( ta );
      context[ ta + "Height" ] = h.style.height;
    } );
  }
 
  
/*  let hist = document.getElementById( "history" );
  localStorage.getItem( "openAiHistory" );
  getModels();
  */
   
/*  function getModels() {                           /** Retrieve chatgpt supported models */ /*
    const subscriptionKey = "Bearer " + localStorage.getItem( "openAiKey" );
    const endpoint = 'https://api.openai.com/v1/models';
    
    fetch( endpoint, {
      mode:      "cors",
      headers: { "Authorization": subscriptionKey }
    } )
    
    .then( response => response.json() )
    .then( obj => 
      document.getElementById( "models" ).innerHTML = 
      obj.data.map( item => "<option value='" + item.id + "' > " + item.id + " </option>" )   
    )
    .catch( error => {
      console.error( error );
    });
  }
  */
  
/*  function pickModel() {                           /** Choose one of the chatgpt supported models */ /*
  }
*/  
  
/* --- repeating prompts -----------------------------------------------------------------
Please simplify the following text without comment. 

Reword the following text so that a 6th grader, whose primary language is non-English, can understand it. 

Convert the following text to Hindi.

Reduce this text to 5 bullet points.
-------------------------------------------------------------------- */
     
/* --- source text -----------------------------------------------------------------   
# Learning Principles - Facilitator Guide

# Principles of Training

[Learning Principles - Facilitator Guide A4.pdf](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9f49c9a9-0322-47fe-95c8-73ceba9cf5da/Learning_Principles_-_Facilitator_Guide_A4.pdf)

**Adult Learning Principles**

Objectives:

- Apply principles of adult learning and how adults use their knowledge, skills, and attitudes in a training environment or while engaged in work
- Applying techniques for enhancing learner engagement

Section Overview

“The purpose of this section is to provide new instructors with an overview of adult learning principles. It contains detailed descriptions of each adult learning principle.”

### Opening Activity

The key to making this a successful training event is to model the behaviors you expect students to emulate. For the adult learning principles open up with an activity that incorporates these learning principles.

## Climate Setting

### Exercise - Setting the Climate

This activity serves as both an example of an opener activity and as a valuable comparison in its own right. Read the instructions in the learner guide and capture as many characteristics as your learners can come up with that describe a boring class. This is an opportunity for you to illustrate the use of humor in class by reading the instructions like this, “Think of the most boring class you have attended (outside of this class of course)…” Your instructor candidates will appreciate it and it will demonstrate an appropriate use of humor in climate setting.

After you have read the instructions, solicit as many responses from the class as you can. Many of them will be similar. Using a whiteboard or flip chart, divide it into left and right columns. Ask the learners to list the characteristics of a boring class. Record their answers. Collect enough responses to identify all the opposites of the six learning principles.

Once you have captured all the ideas and condensed or categorized similar responses, then ask learners to describe what the opposite characteristic of each is and record it in a second column next to the first. If you have not already done so, direct them to copy the list from the board or PowerPoint presentation into their learner guides. When they are done, congratulate them on coming up with a very thorough list and transition to the slide on the six principles of adult learning.

Your finished chart will look something like this:

| Characteristics of a Boring Class | Characteristics of a Good Class |
| --- | --- |
| Speaker uses a monotone voice. | Speaker varies voice tone, volume, and speaks enthusiastically. |
| All lecture, no activities. | Variety of activities and presentation styles. Do not conduct an activity for more than 20 minutes without varying it in some way. |
| Speaker reads from slides or instructor guide. | Speaker addresses audience rather than screen. |
| Speaker does not make eye contact. | Speaker maintains eye contact and rapport with learners. |
| Speaker ignores learner questions or does not answer them adequately. | Speaker answers questions directly and then checks for understanding. |
| Speaker does not allow for audience participation, questions, or discussion. | Use a variety of styles in a presentation including question and answer. |
| Boring content or subject matter. | Use a WIIFM? and Big Picture discussion to relate class to learners. |

### Learner Engagement

The single word that best describes the difference between a good class and a boring class is that the good class is the one in which the learners are most **engaged.** The more engaged learners are, the more motivated they will be in class. Let them know we will discuss learner engagement in more detail in a later session. For now, we will look at the basic principles of adult learning.

Six Principles of Adult Learning

These six principles provide the foundation for everything else in this course. Make sure you have them memorized and refer to them often during your presentation. Whenever you complete an activity, it would be good to reinforce these principles by asking instructor candidates which principle(s) the activity incorporated or demonstrated. Frequent repetition of these principles will help instructor candidates to remember them. Relate the principles to the factors that the learners listed. While there may not be a direct correlation, the characteristics they identified will relate to an established adult learning principle.

|  | You may want to consider creating a poster along with the accompanying PowerPoint presentation to reinforce the six Principles of Adult Learning |
| --- | --- |

“Adults learn best when they:

- “Are highly motivated
- “Relate learning to life experiences
- “Analyze experiences
- “Participate in their learning
- “Maintain their self-esteem, and
- “Are valued for their individual differences.”

When elaborating on each of these principles, refer back to the list that they generated and highlight how they have already expressed each of these principles in their own words.

**Motivation**

Ask the class to suggest some methods for motivating learners. Then ask them how you incorporated this principle in today’s class. Have them list these examples in their Learner Guide. Ask them to suggest ways they might incorporate these same practices in how they conduct training. Encourage them to take notes on these suggestions

**Relation**

Point out how you used the opener or icebreaker portion of the class to solicit information about their background and prior experience before starting with the class. Have them list these examples in their Learner Guide.

Make sure they know that the value of the activity was not simply to introduce themselves to one another and set the tone for the class, but the opener or icebreaker also served as a tool for the instructor to find out who the learners are, what their background and experience is, and how they can incorporate the knowledge from class back to their translation workplace setting. Emphasize that one of the tasks of good instructors is to make the training relevant to the learners by showing the relationship between the content of the class and interests of the learner.

**Analysis**

Ask the instructor candidates what sort of analysis they have already performed on this class. Be prepared to handle a variety of responses. Point out that their learners are going to be doing much the same kind of analysis in the courses they will be teaching. Ask them to provide some ideas about the kind of analysis they can expect from their learners when they begin training.

**Participation**

Point out the number of opportunities you have already provided for instructor candidates to participate in the learning process. Ask them how they think this has contributed to the class so far. Ask them how they think the class would have gone if you had not involved them as much. Encourage them to list examples of classroom participation in their Learner Guide. Suggest that they will succeed as instructors precisely to the degree that they involve others in the learning process.

**Self-Esteem**

Emphasize that maintaining self-esteem does not mean you cannot correct learners when they make mistakes. It means that you correct them in way that is meaningful, relevant, and respectful.

**Individuality**

Have the class suggest ways in which individual differences could impact their training and how they would accommodate those differences. Ask, “What are some individual differences that learners want appreciated?” Follow up with a brief discussion on how to honor these individual differences.

**Summary**

Review the six principles of adult education.

Adults learn best when they:

- Are highly motivated
- Relate learning to life experiences
- Analyze experiences
- Participate in their learning
- Maintain their self-esteem, and
- Are valued for their individual differences.

Transition to the next section by stating:

“The next section of this class will look at these principles in detail. We will discover some key strategies for incorporating these principles into actual training situations.”

**Applied Learning Principles**

**Section Overview**

“The purpose of this section is to give you an opportunity to apply these adult learning principles. You will have an opportunity to:”

|  | ●       “Identify two techniques for enhancing learner engagement”
●       “Demonstrate how to build staff ownership and support for training initiatives”
●       “Apply a four-step process to the practice of facilitation”
●       “Provide effective feedback that enhances learner performance” |
| --- | --- |

**Enhancing Engagement**

|  | Emphasize that adults are motivated by their ability to contribute to a worthwhile endeavor in a meaningful way. Two of the most common ways to accomplish this are to explain the Big Picture and use WIIFM statements. 
 |
| --- | --- |

You can do a mini role play by introducing a sample course in two different ways such as:

- “Today we are going to learn how to use tCore to do translation checks. We will start with the book of Titus and after you get some experience with that, we will move on to the book of Ruth in the Old Testament.”

Compared to:

- “Today we are going to learn how to use tCore to do translation checks as part of the Checking step in the overall translation process. The reason translation checks are important is because we want to offer translations that are clear, accurate, natural, and likely to be church-approved. This means that all the effort you put into generating a good translation will pay off with a high-quality document that benefits from being checked by multiple people.”

You may use a different example that is relevant for the learners in the class you are teaching. The main point is that you demonstrate the difference between introducing training without using the motivational techniques of explaining the **Big Picture** and giving a **WIIFM** message compared to introducing training missing one or both of these messages. Ask the instructor candidates to give examples of how they can include the **Big Picture** and **WIIFM** information in the classes they will be introducing and record them in their books.

***The Big Picture***

Some possible responses relating to the Big Picture are:

- We train to enhance the quality of the Bibles we produce.
- We reduce costs and time by improving the ability to check translations quickly and easily
- We want to provide a Bible that is beloved by the people who receive it

***WIIFM***

Some possible response relating to WIIFM? include:

- The translation process is complex and can be hard to understand, but this training will help them to organize the process for ease of understanding
- They want to produce good translations and this training will help them understand what makes a translation a “good” one.
- They want to remain a valuable contributor to translation efforts and this training will help make them a valued partner in the work.
- They want to avoid mistakes that could lead to errors and misunderstandings in the church.

**Enhancing Ownership**

Take this opportunity to encourage the attendees in this class to take ownership of the training outcomes. While they should be encouraging their learners to always do quality work, you should also encourage them to apply the same standards to the training they conduct. They would never want to translate an unsuitable product, so encourage them to never release an unsuitably trained learner to perform independently.

**Facilitation**

Facilitation is the act or process of making something easier. Ask the participants to identify some ways you have made training easier today. Capture their responses on a whiteboard or newsprint. Ask them to identify how these actions fit within the four steps of good facilitation.

|  | ●       Observing
●       Questioning
●       Listening
●       Feedback |
| --- | --- |

Discuss each of these items in detail using the content from the learner guide.

- *Observing* - Relates to the instructor candidate’s ability to use observation skills to understand the kind of experiences that the learner is having.
- *Questioning* - Make sure you emphasize the difference in asking open questions and closed questions. Identify for your students when each type is most appropriate.
- *Listening* - Listening involves more than just the words that people are saying. Good instructors “listen” to the facial expression and body language as well. One way to show that you are listening is to use the following active listening skills:
- Paraphrasing - putting their question in your own words to make sure they are clearly understood.
- Restating - This involves repeating question back to learners. Use this technique sparingly as it can quickly become annoying.
- *Feedback* - This is the response that we give back to learner performance.

Before going on to the section on feedback, spend some time demonstrating how to use questioning strategies effectively. Tell your participants that it is possible to achieve a desired outcome simply by asking the right questions and providing feedback based on the learner’s response.

An example of how to conduct a Question-Response interchange is included here called the “Pick A Card Demonstration.” You may modify this demonstration or substitute a similar one that illustrates both good questioning practices and examples of how to provide good feedback.

This demonstration serves as a bridge between using effective questioning strategies and the importance of providing appropriate feedback. If you substitute another activity of your own, make sure it emphasizes the two points of using effective questioning strategies and providing appropriate feedback.

***State***:

“This demonstration is intended to illustrate the following key points:

- “The power of questions to engage the learner in discovering answers for themselves
- “The ability of good questions to provide information that directs learners in the direction they should go
- “The value of wrong answers, when handled correctly, to direct learners to helpful information
- “The importance of providing positive feedback that affirms the effort while correcting errors in a way that maintains learner self-esteem

**Pick a Book Demonstration**

*Instructions:*

Conduct this demonstration by selecting a volunteer from the class to act as the “learner.” Tell them that after answering a series of questions, they will be able to correctly identify a book of the Bible chosen at random by another class member. Have a volunteer from the class either choose a book of the Bible at random, write it on a card, and give it to you, or if you do not want to bring index cards to class, have them choose one mentally, write down their choice on a piece of paper and give it to you.

Next, you will ask a series of questions until the “learner” has correctly identified the book that the other person picked. In order to insure they successfully identify the right book that the other volunteer picked you will provide effective feedback to direct their efforts and follow up with another question.

Two main considerations enable this exercise to run successfully — the type of *questions* you will use and the *feedback* that you provide to your “learner” as they make their guesses. In order to prepare for this exercise study the following questions carefully and notice the order in which they are asked. Note that they move from the more general to the more specific as we narrow down the possible correct answers. You will also need to be prepared to provide effective feedback that helps them arrive at the correct answer will maintaining their self esteem. Review the feedback examples and try to use a unique response every time so you do not repeat any of the examples. A sample script is provided as an example of how this demonstration might play out.

The key elements are the use of carefully selected questions that guide the learners to a successful outcome and the use of effective feedback that:

- Affirms the learner’s effort (positive reinforcement)
- Avoids the use of “but” as in “That was a good effort, but ...”
- Provides helpful information that guides the learner in the right direction, preferably using another question.

***Example Questions***

- “In the Bible, there are two testaments, the Old and the New. Which testament do you think this person picked?”
- “Of that testament there are four sections. Which section would you think this person would pick?” (Old Testament sections: Pentateuch, History, Poetry, Prophets; New Testament sections: Gospels, History, Epistles, Prophecy)
- “Of that section there are sub-sections. Which sub-section do you think this person is most likely to pick?”
    - Pentateuch – Law or History
    - History – Pre-exilic or Post-exilic
    - Poetry – Davidic or Non-Davidic
    - Prophets – Major or Minor
    - Gospels – Synoptic or non-Synoptic
    - History – Acts is the only one
    - Epistles – Pauline or General
    - Prophecy – Revelation is the only one
- “Of the [sub-section] there are different divisions [see below]. How do you think this person chose?”
    - Pentateuch –
        - Law – Priestly Law (Leviticus) or Restated Law (Deuteronomy
        - History – Ancient (Genesis), Contemporary (Exodus) or Chronicle (Numbers)
    - History –
        - Pre-exilic – Pre-Kingdom (Joshua, Judges, Ruth) or Post-Kingdom (Samuel, Kings, Chronicles)
        - Post-exilic – Scribal (Ezra), Administrative (Nehemiah), or Narrative (Ester)
    - Poetry –
        - Davidic (Psalms)
        - Non-Davidic – Solomonic (Proverbs, Ecclesiastes, Song of Solomon), non-Solomonic (Job)
    - Prophets –
        - Major – Exilic (Isaiah, Jeremiah, Lamentation) or post-Exilic (Ezekiel, Daniel)
        - Minor – Judean, Israelite, or Neither (Obadiah)
            - Judean – Pre-exilic (
            - Israelite -
        - Gospels – Synoptic or non-Synoptic (John)
        - History – Acts is the only one
        - Epistles –
            - Pauline
                - Pastoral (Timothy, Titus)
                - Ecclesiastical (Romans, Corinthians, Galatians, Ephesians, Philippians, Thessalonians)
                - Personal (Philemon)
            - General (Peter, John, or Jude)
        - Prophecy – Revelation is the only one
    - “Of the [correct choice] there are [smaller divisions]. Which do you think this person picked?”

Continue either/or choices until the next question will lead to the correct answer. Conclude by saying, “You are now ready to choose which book of the Bible our volunteer chose. What card did they pick?” Acknowledge their successful completion of the exercise.

***Example Feedback***

The key to successfully completing this demonstration and the main point of the exercise is that the instructor must have a positive response ready for every wrong response that the learner gives, which will direct them to the correct answer. Examples include:

- “That is exactly what I would have thought; however, the correct answer is?”
- “I would have felt the same way; and a better answer would be?”
- “Other people have thought the same thing; however, a more accurate answer would be?”
- “On most days we could expect that answer to be correct; so what do you think the correct answer is today?”
- “For most organizations we would expect that to be a fine choice; except here the preferred choice is actually what?”
- “In this country we would expect most people to choose that; although what they really chose was what?”
- “They are from a country where we would expect that to be a common answer even though they did something different which was what?”

You may use any others that you can come up with as long as they are all positive, nonjudgmental, and direct the learner to the correct choice with a minimum of prompting. Take special care to make sure that you do not repeat any responses.

Notice how this demonstration might look by reading through the example script below.

***Example Instructor Script***

I = Instructor

L = Learner

I:          This next exercise will demonstrate how it is possible, using only questions, to guide a learner to a successful learning outcome. I need a volunteer to choose book of the Bible at random, write their choice on a piece of paper so no one can see, and hand it to me. [Choose volunteer, have them choose a card, write it on a piece of paper, and hand it to you.] Thank you. Now I need a volunteer to be the learner, someone who is familiar with the books of the Bible. I am going to ask a series of questions and when I am done, you will be able to tell me what book our volunteer picked. [Choose a volunteer learner.]

Thank you for volunteering. Based on what you know of our volunteer would you say that they are likely to pick a book from the Old Testament or the New Testament?

L:         The Old Testament.

I:          That is exactly what I would have said. However, the book that our volunteer actually picked out is…?

L:         The New Testament.

I:          Correct. And of the New Testament books, there are four sub-divisions: Gospels, History, Epistles, and Prophecy. Which do you think they would have picked?

L:         Prophecy.

I:          And that would be a good answer on most days. Today, however, they picked…?

L:         Gospels.

I:          Almost! Take a good look at them and ask yourself, what would they have chosen for real?

L:         Epistles

I:          Excellent. And of the epistles, would they have chosen a Pauline Epistle or a General Epistle?

L:         A General Epistle.

I:          Most volunteers in a similar situation would have picked a General Epistle. Our volunteer is not like most others, so they picked…?

L:         A Pauline Epistle.

I:          That is exactly correct. And of the Pauline Epistles, there are pastoral epistles, church epistles, and one personal epistle. Would our volunteer have picked a personal, pastoral, or church epistle?

L:         A personal epistle.

I:          I can see how you came to that conclusion. Our volunteer, however, actually picked…?

L:         A church epistle.

I:          Perfect. Yes, they picked a church epistle. Now would you expect them to pick a church that received a single epistle or one that received multiple epistles?

L:         A single epistle.

I:          And that would also have been a perfect choice if we had picked a different volunteer. Our volunteer actually picked…?

L:         A multiple epistle.

I:          Exactly. Now which high multiple epistle do you think they would have picked – Corinthians or Thessalonians?

L:         Corinthians.

I:          That was a very good answer and it is very close to the correct one. Would you like to choose again?

L:         Thessalonians.

I:          Well done. And would they have picked 1 Thessalonians or 2 Thessalonians

L:         2 Thessalonians

I:          You have successfully eliminated all the books that our volunteer could not have picked. So now you can confidently state which book they did pick. What book of the Bible did our volunteer choose?

L:         1 Thessalonians

I:          That is correct! They did choose the book of 1 Thessalonians. Can I have a round of applause for our volunteer’s successful completion of this exercise?

***Debrief/Discussion***

You may then transition from this exercise directly into the next topic of providing feedback by asking the questions below.

- “Were the questions open or closed questions?” *Use this question to reinforce the value of both types of questions depending on the learning situation.*
- “Were all the learner’s answers correct?” *Use this question to highlight the value of wrong answers as teachable moments and learning opportunities. You may mention that we sometimes learn more from our mistakes than we do when we get things correct.*
- “How did I maintain the learner’s self-esteem?” *You pointed out what was wrong and what they could do to succeed.*
- “What are the two main characteristics of effective feedback?” *This leads into the next segment on feedback as you discuss what it means to be positive and how feedback is helpful information that is action focused.*

Emphasize the connection between facilitation (the art of making things easier) and feedback (finding out where learners are having trouble and guiding them to improved performance). Explain, “Facilitation is *what* we do and feedback is *how* we do it. Effective feedback is essential to effective facilitation.”

**Feedback**

There are three basic concepts instructor candidates should get from this section.

These are:

|  | ●       A definition of feedback (helpful information that is action focused)
●       Avoid the use of “but” when providing feedback.
●       A way to evaluate feedback (SMART) |
| --- | --- |

Clarify the meaning of positive feedback. Tell them, “When we use the term ‘positive feedback’ we do not mean that it is always upbeat and intended to make the learner feel good about themselves. We use the term to indicate that it positively directs the learner to what they are supposed to be doing. This is contrasted with ‘negative feedback’ which focuses on what they are not supposed to do. To summarize, ‘positive feedback’ is **helpful information** that is **action focused**.”

Solicit examples of ineffective feedback and effective feedback from your instructor candidates. You may capture these on a whiteboard or newsprint and have them list them in their Learner Guides.

Explain the **SMART** acronym as a way to gauge whether feedback is truly positive. Generally, feedback that meets SMART criteria will be effective feedback.

The section on **avoiding the “B” word** is an easy concept to grasp but difficult to execute. One key to making this successful is to model this behavior throughout the class. Your learners will imitate you, so it is important that you demonstrate alternatives to using the “B” word when providing feedback. It is a hard habit to break but one that must be broken in order to consistently maintain learner self-esteem.

**Summary/Exercise**

You have two options for summarizing this section based on the amount of time available, the composition of the class and your delivery style. You can review the summary information in the learner guide in **Assignment 1: Delivering Feedback** or you can conduct a feedback role playing exercise and debrief to highlight the main points of this section, or both. An example feedback role playing exercise is provided called the “Candy Sorting Exercise.” You may use this exercise or you may choose an exercise that is relevant to your class. You can adapt this by sorting buttons, office supplies, or any other small items you have available as training aids. The items being sorted are not as important as providing an opportunity to practice the skills they just observed in class.

This exercise is intended to give the instructor candidates practice in providing effective feedback. If you use a substitute activity, make sure you include these elements:

- A simple procedure that is easy to explain and complete
- An opportunity for the person in the learner role to fail on the first attempt
- A means for the person in the instructor role to provide effective feedback

**The Candy Sorting Exercise**

**Description:** The purpose of this exercise is to provide participants with an opportunity to practice coaching and feedback skills. It is designed as a sample training event to permit learners to provide feedback to their learners/peers.

Steps

1. Divide the class into pairs or groups of three depending on the size of the class and time available.
2. Explain the responsibilities of each role within the groups using the following scenario and instructions:

***Scenario “***Based on complaints we have received from previous classes, we have been told that we must keep certain types of candies in a temperature-controlled environment at all times in order to maintain their quality. This requirement applies to chocolates and other candies that would be adversely affected by temperatures in excess of 30o C. Other candies such as hard candy can be safely maintained in a non–temperature-controlled environment without adversely affecting product quality. Because we have limited space in temperature-controlled environments, we have decided to segregate temperature-sensitive candies from non–temperature-sensitive candies and store them separately. Staff new to the task of sorting candy must be trained in proper identification and segregation techniques to ensure that our products meet the highest quality standards possible.”

If you are substituting another sorting activity, make sure you have a similarly plausible rationale. For example:

- If sorting paper clips, explain that large and small paper clips need to be separated for cost controlling purposes. Or paper clips and binder clips need to be segregated to improve efficiency.
- If sorting buttons, you can sort them by size, color, or number and type of hole. However, make sure there is a logical reason for separating them.
- If sorting sticky notes or other office paper supplies, you might separate them based on cost and the need to reduce expenses.

***Roles “*Instructors,** it is your job to train your staff person to the new Candy Sorting Procedure so that they can accurately segregate temperature-sensitive from non–temperature-sensitive candies. This will allow us to store candy appropriately and maintain product quality and compliance.

**“Learners,** it is your job to practice the Candy Sorting Procedure until you get it right. You will not be successful on your first attempt, but with practice, feedback, and guidance from your instructor you will ultimately succeed.

**“Observers** (If used)**,** it is your job to evaluate the coaching provided to the learner. Watch the session carefully and share your findings with the rest of the group.

“After each round of ‘training,’ switch roles until everyone in the group has had an opportunity to be instructor, learner, and observer.”

**Discussion questions**

When everyone is finished, solicit comments from the instructor candidate that highlight the key points of this section listed above. Have them record their responses in Assignment 1: Delivering Feedback. You may use the sample questions below for discussion.

- “In what way did you provide helpful information that was action focused?”
- “Were you able to avoid using the “b” word? How easy or difficult was this?”
- “What were some alternatives you used?”
- “How did you feel providing this type of feedback? How likely are you to make this a natural part of your training style? What would help you in this regard?”
- “How well did your feedback maintain learner self-esteem? Learners, how did you feel receiving the kind of feedback you did? How well do you think this will work in a real training setting?”
- “Did anyone begin their training session by using a Big Picture or WIIFM? explanation? How did that go?”

**Unit Checkpoint**

Depending on your schedule, this is a good point to take a break. The first part of the course dealt with *principles* and the remaining section will deal with *practices*. Summarize how far they have come and what remains ahead of them.

“Here is what we have covered so far:

- “The Six Principles of Adult Learning. What are they?”
- “We discussed two ways to motivate learners. What are they?
- “Who owns the outcome for training?”
- “What is facilitation? How do we make things easier for our learners?”
- “What are the two characteristics of effective feedback? What acronym do we use to make sure our feedback is helpful information that is action focused?”

“Here is what we have left to cover in the next section:

- “We will learn a six-step method for teaching a skill called the Behavior Modeling Process and use it to teach a skill.”
- “We will learn what to do to ensure a successful outcome of a training event through coaching and negotiating.”
- “We will learn how to evaluate the effectiveness of the training we deliver.
  */
   
  async function simplify() {                        /** Walk through the source text breaking off chunks and sending them to chatgpt */
    //markState( "Playing" );
    started = true;
    let src  = document.getElementById( "sourceText"  );
    clearChunks( "thisChunk simpleChunk target" );
/*  // manage history  
    let hist = document.getElementById( "history" );
    let combined = localStorage.getItem( "openAiHistory" );
    hist.value = combined;
*/    

    srcText = src.value;
console.log( "|" + srcText + "| ChunkSize: " + context.chunkSize );  
    let chunkN = parseInt( srcText.split( " " ).length / context.chunkSize );
    context.chunkCount = 1;
    let thisChunk = "";
//    document.getElementById( "target" ).value = "";
    let current = document.getElementById( "thisChunk" );
     document.getElementById( "simpleChunk" ).value = "";
     
    while( srcText.length > 0 ) {
      let pos = srcText.split( " ", context.chunkSize ).join( " " ).length;

      if( pos < 0 ) {  // if no delimiter then send whole chunk
        thisChunk = srcText;
      } else {
        thisChunk = srcText.substring( 0, pos );        
      }
     
      let separatorPosition = thisChunk.lastIndexOf( context.separator ).length;

      if( separatorPosition >= 0 ) { // backup to separator
        thisChunk.substring( 0, separatorPosition );
      }
      
      current.value = thisChunk;
      console.log( "Simplify chunk: " + context.chunkCount );   
      document.getElementById( "chunkNumber" ).innerText = context.chunkCount;
      document.getElementById( "chunkProgress" ).value = parseInt( ( context.chunkCount / chunkN ) * 100 );
      await simplifyText( thisChunk, context.chunkCount );
      context.chunkCount += 1;
      
      document.getElementById( "thisChunk" ).value = thisChunk;
      srcText = srcText.substring( thisChunk.length + 1 );
      src.value = srcText;
     
      if( machineState.indexOf( "Canceling" ) >= 0 ) {
        startStop( "play next", "pause redo cancel" );
        break;
      }
        
      console.log( "sleeping." );        
      await sleep( 1000 );
      
      if( machineState.indexOf( "Stepping" ) >= 0 ) { // if next then set to pause after 1 loop
        console.log( "had single stepped" );
        markState( "Pausing" );
      }
      
      while( machineState.indexOf( "Pausing" ) >= 0 ) {  // wait for redo or next 
        startStop( "play next redo cancel", "pause" );             
        await sleep( 2000 );
      }

       
      //markState( "Playing" );
      console.log( "Processing." );        
       
      if( candidate.length > 10 ) {
        document.getElementById( "target" ).value += candidate;
        candidate = "";
      }
      
/*
      hist.value += "\n" + srcText;
      localStorage.setItem( "openAiHistory", hist.value );
      src.value = ""
*/

    }
    
    console.log( "Complete." );   
    startStop( "play next", "pause redo cancel" );
    markState( "Idling" );
  }

  async function simplifyText( text, chunkCount ) {  /** invoke chat-gpt */
    const subscriptionKey = "Bearer " + localStorage.getItem( "openAiKey" );
    //const organizationKey = localStorage.getItem( "openAiOrg" );
    const endpoint = 'https://api.openai.com/v1/chat/completions';
/*    
    const queryParams = '?q=' + encodeURIComponent( text ) + 
        '&count=10&offset=0&mkt=en-us&safesearch=Moderate';
    let model = document.getElementById( "models" );
    selectedModel = model.value;
*/
     
    await fetch( endpoint, {
      method:   "POST",
      mode:     "cors",
      headers:  {
        "Content-Type":  "application/json",      
        "Authorization": subscriptionKey
      },
      "body": JSON.stringify( {
        "model":      "gpt-3.5-turbo", //selectedModel, 
        "temperature": 0.2,
        "messages": [ {
           "role":    "user", 
           "content": context.repeatingContext + " " + text
         } ] 
       } )
    } )
    .then( response => response.json() )
    .then( data => { 
      console.log( "Simplified in target" );    
      var sep = "\n";
      
      if( context.isMarkChunk ) {
        sep = "\n\n---" + chunkCount + "---\n\n";
      }
      
      document.getElementById( "simpleChunk" ).value =   data.choices[0].message.content;
      document.getElementById( "simplifiedNumber" ).innerText = chunkCount;
      candidate = sep + data.choices[0].message.content;
//      document.getElementById( "target" ).value += sep + data.choices[0].message.content; 
    } )
    .catch( error => {
      toast( error.message, "Fault" );
//      document.getElementById( "chatError" ).innerText = error.message;
    });
    
  }
    
  function setKey() {                                /** Save secret chatgpt key in localstorage */    
     var retVal = prompt("Enter your OpenAI API Key: ", "your key here" );
     
     if( retVal.length > 20 || retVal.indexOf( "your key here" ) < 0 ) {
       localStorage.setItem( "openAiKey", retVal );
     }
  }
  
  function startStop( buttonStart, buttonStop ) {    /** turn on and off sets of action buttons */
    if( buttonStart != "" ) {
      var startList = "#" + buttonStart.trim().split( " " ).join( ", #" );
      $( startList ).removeClass( "disabled-button" );
    }
    
    if( buttonStop != "" ) {
      var stopList = "#" + buttonStop.trim().split( " " ).join( ", #" );
      $( stopList ).addClass( "disabled-button" );
    }
  }
  
  function toast( msg, st ){                  /** Post up message then log it */
    $( '.toaster' ).html( msg );
    $( '.toaster',  ).addClass( 'show' );

    setTimeout( function(){ // After 5 seconds, remove the show class from DIV
      $( '.toaster',  ).removeClass( 'show' ); 
    }, 5000 );
  }
  
  function toggle( divId ) {                         /** toggle div visibility */
    $( divId ).toggle();
  }
  
  function sleep( ms ) {                             /** suspend processing for some time */    
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
