// Stored on each Puck block; the same value drives preview and publication.
export const BACKGROUNDS=['white','blue','pink','wine'];
export const BLOCK_BACKGROUNDS={ChecklistContents:'white',ChecklistAudience:'pink',ThankYou:'pink',Journey:'white',InfoCards:'white',Hero:'wine',Quote:'wine',Checklist:'blue',Availability:'blue',ContactForm:'pink',Stories:'blue',StoryCarousel:'wine',Orbit:'blue',Mosaic:'white',Review:'wine',Wall:'blue',About:'white',Journal:'pink',FAQ:'white',Method:'white',Pricing:'blue',ContactCTA:'wine',Social:'pink',Intro:'white',Steps:'white',Photo:'white',Video:'white',Text:'white'};
BLOCK_BACKGROUNDS.SingleReview='wine';
BLOCK_BACKGROUNDS.TiltCard='pink';
BLOCK_BACKGROUNDS.FanGallery='pink';
export const defaultBackground=type=>BLOCK_BACKGROUNDS[type]||'white';
