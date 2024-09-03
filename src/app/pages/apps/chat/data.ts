/**
 * Group List
 */
 const groupData = [
    {
        name: 'Landing Design',
        unread: '7'
    },
    {
      name: 'General'
    },
    {
      name: 'Project Tasks',
      unread: '3'
    },
    {
        name: 'Meeting'
    },
    {
        name: 'Reporting'
    },
  ];
  
  /**
   * Chat List
   */
   const chatData = [
    {
        image: 'assets/images/users/avatar-2.jpg',
        name: 'Lisa Parker',
        status: 'online'
    },
    {
        image: 'assets/images/users/avatar-3.jpg',
        name: 'Frank Thomas',
        status: 'online',
        unread: '8'
    },
    {
      name: 'Clifford Taylor',
      status: 'away'
    },
    {
        image: 'assets/images/users/avatar-4.jpg',
        name: 'Janette Caster',
        status: 'online'
    },
    {
        image: 'assets/images/users/avatar-5.jpg',
        name: 'Sarah Beattie',
        status: 'online',
        unread: '5'
    },
    {
        image: 'assets/images/users/avatar-6.jpg',
        name: 'Nellie Cornett',
        status: 'away',
        unread: '2'
    },
    {
        name: 'Chris Kiernan',
        status: 'online'
    },
    {
        name: 'Edith Evans',
        status: 'away'
    },
    {
        image: 'assets/images/users/avatar-7.jpg',
        name: 'Joseph Siegel',
        status: 'away'
    },
  ];
  
  /**
   * Chat Message List
   */
   const chatMessagesData = [
    {
        profile: 'assets/images/users/avatar-2.jpg',
        message: 'Good morning 😊',
        time: '09:07 am'
    },
    {
        align: 'right',
        message: 'Good morning, How are you? What about our next meeting?',
        time: '09:08 am'
    },
    {
        message: 'Yeah everything is fine. Our next meeting tomorrow at 10.00 AM',
    },
    {
        profile: 'assets/images/users/avatar-2.jpg',
        message: `Hey, I'm going to meet a friend of mine at the department store. I have to buy some presents for my parents 🎁.`,
        time: '09:10 am'
    },
    {
        align: 'right',
        message: `Wow that's great`,
        time: '09:12 am'
    },
    {
        profile: 'assets/images/users/avatar-2.jpg',
        time: '09:30 am',
        image: ['assets/images/small/img-1.jpg', 'assets/images/small/img-2.jpg']
    },
  ];
  
  export { groupData, chatData, chatMessagesData };
  