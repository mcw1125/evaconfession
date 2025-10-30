// Sins for children's examination of conscience - worded for confession
const sinsData = [
    {
        category: "The First Commandment: I am the Lord your God, you shall have no other gods before me",
        sins: [
            { text: "I have not prayed every day", type: "venial" },
            { text: "I have missed my morning or night prayers", type: "venial" },
            { text: "I have put video games or TV before God", type: "venial" },
            { text: "I have been superstitious or believed in horoscopes", type: "venial" },
            { text: "I have not thanked God for my blessings", type: "venial" },
            { text: "I have been lazy about learning my faith", type: "venial" }
        ]
    },
    {
        category: "The Second Commandment: You shall not take the name of the Lord your God in vain",
        sins: [
            { text: "I have used God's name when I was angry", type: "venial" },
            { text: "I have used God's name without respect", type: "venial" },
            { text: "I have not kept promises I made to God", type: "venial" },
            { text: "I have said bad words using holy names", type: "venial" }
        ]
    },
    {
        category: "The Third Commandment: Remember to keep holy the Lord's Day",
        sins: [
            { text: "I have missed Mass on Sunday without a good reason", type: "venial" },
            { text: "I have been late to Mass because I wasn't ready", type: "venial" },
            { text: "I have not paid attention during Mass", type: "venial" },
            { text: "I have been distracting to others during Mass", type: "venial" },
            { text: "I have complained about going to Mass", type: "venial" },
            { text: "I have not made Sunday a special day for God", type: "venial" }
        ]
    },
    {
        category: "The Fourth Commandment: Honor your father and mother",
        sins: [
            { text: "I have disobeyed my parents", type: "venial" },
            { text: "I have talked back to my parents", type: "venial" },
            { text: "I have not done my chores when asked", type: "venial" },
            { text: "I have complained about helping around the house", type: "venial" },
            { text: "I have been disrespectful to my parents", type: "venial" },
            { text: "I have lied to my parents", type: "venial" },
            { text: "I have not listened to my teachers", type: "venial" },
            { text: "I have been disrespectful to adults", type: "venial" }
        ]
    },
    {
        category: "The Fifth Commandment: You shall not kill",
        sins: [
            { text: "I have hit my brothers or sisters", type: "venial" },
            { text: "I have hurt other children", type: "venial" },
            { text: "I have said mean things to hurt others' feelings", type: "venial" },
            { text: "I have called people names", type: "venial" },
            { text: "I have been a bully", type: "venial" },
            { text: "I have held grudges and not forgiven others", type: "venial" },
            { text: "I have wished bad things would happen to others", type: "venial" },
            { text: "I have not stood up for someone being bullied", type: "venial" }
        ]
    },
    {
        category: "The Sixth & Ninth Commandments: Be pure in thought and action",
        sins: [
            { text: "I have used bad words", type: "venial" },
            { text: "I have told or listened to dirty jokes", type: "venial" },
            { text: "I have not dressed modestly", type: "venial" },
            { text: "I have been immodest in my actions", type: "venial" },
            { text: "I have not respected my body as God's temple", type: "venial" }
        ]
    },
    {
        category: "The Seventh & Tenth Commandments: You shall not steal / You shall not covet your neighbor's goods",
        sins: [
            { text: "I have taken things that don't belong to me", type: "venial" },
            { text: "I have not returned borrowed items", type: "venial" },
            { text: "I have damaged others' property", type: "venial" },
            { text: "I have been jealous of others' toys or things", type: "venial" },
            { text: "I have been greedy with my things", type: "venial" },
            { text: "I have not shared with others", type: "venial" },
            { text: "I have cheated on tests or schoolwork", type: "venial" },
            { text: "I have copied someone else's work", type: "venial" }
        ]
    },
    {
        category: "The Eighth Commandment: You shall not bear false witness against your neighbor",
        sins: [
            { text: "I have lied to my parents", type: "venial" },
            { text: "I have lied to my teachers", type: "venial" },
            { text: "I have lied to my friends", type: "venial" },
            { text: "I have gossiped about others", type: "venial" },
            { text: "I have spread rumors", type: "venial" },
            { text: "I have told secrets I shouldn't have", type: "venial" },
            { text: "I have blamed others for my mistakes", type: "venial" },
            { text: "I have not told the truth when I should have", type: "venial" }
        ]
    },
    {
        category: "Precepts of the Church",
        sins: [
            { text: "I have missed Mass on Sunday", type: "venial" },
            { text: "I have not gone to confession when I should", type: "venial" },
            { text: "I have not received Communion during Easter", type: "venial" },
            { text: "I have eaten meat on Friday during Lent", type: "venial" },
            { text: "I have not fasted when the Church asks", type: "venial" }
        ]
    },
    {
        category: "The Seven Deadly Sins",
        sins: [
            { text: "I have been proud and bragged about myself", type: "venial" },
            { text: "I have been greedy and wanted more toys or things", type: "venial" },
            { text: "I have been jealous of what others have", type: "venial" },
            { text: "I have been angry and lost my temper", type: "venial" },
            { text: "I have eaten too much candy or junk food", type: "venial" },
            { text: "I have been lazy about my chores and homework", type: "venial" },
            { text: "I have not tried my best in school", type: "venial" }
        ]
    },
    {
        category: "Sins Against Charity",
        sins: [
            { text: "I have been mean to other children", type: "venial" },
            { text: "I have not helped others when I could", type: "venial" },
            { text: "I have excluded others from games", type: "venial" },
            { text: "I have not shared my toys", type: "venial" },
            { text: "I have been selfish", type: "venial" },
            { text: "I have not prayed for others", type: "venial" },
            { text: "I have not forgiven those who hurt me", type: "venial" },
            { text: "I have been unkind to animals", type: "venial" }
        ]
    },
    {
        category: "Sins of Omission",
        sins: [
            { text: "I have not prayed every day", type: "venial" },
            { text: "I have not done my homework", type: "venial" },
            { text: "I have not done my chores", type: "venial" },
            { text: "I have not helped my family when I should", type: "venial" },
            { text: "I have not stood up for what is right", type: "venial" },
            { text: "I have not been a good example to others", type: "venial" },
            { text: "I have wasted time when I should have been productive", type: "venial" }
        ]
    }
];
