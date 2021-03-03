import React, { useState, useContext } from 'react';
import QuestionResponse from '../micro-partial/QuestionResponse';
import SubscriptionCard from '../partial/Subscription/SubscriptionCard';
import styles from './Subscription.module.css';
import {DarkContext} from '../partial/Providers'

export default function Subscription() {
  const [questionSelected, setQuestionSelected] = useState();
  const {darkMode} = useContext(DarkContext)

  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container}>
      <div>
        <SubscriptionCard primaryColor='#13bb70' secondaryColor='#effdf6' price={12} title='Bronze' walletSize={1000} priceId={process.REACT_APP_PRICE_ID_BRONZE} />
        <SubscriptionCard primaryColor='#00b6c8' secondaryColor='#edfaff' price={22} title='Argent' walletSize={5000} priceId={process.REACT_APP_PRICE_ID_SILVER} />
        <SubscriptionCard primaryColor='#f6b73e' secondaryColor='#fff9e1' price={29} title='Or' walletSize='> 5000' priceId={process.REACT_APP_PRICE_ID_GOLD}/>
      </div>
      <div className={styles.questions}>
        <ul>
          <QuestionResponse question="Qu'est-ce que la taille maximal du portefeuille sous gestion ?" setQuestionSelected={setQuestionSelected} num={1} show={questionSelected === 1 ? true : false}>
            C'est la somme en dollars maximal que votre plan permet de trader.
            <br />
            Si vous optez pour le plan Argent alors vous pouvez choisir une strategie qui tradera a votre place jusqu'a hauteur de 5000$. Au dessus il faudra opter pour le plan Gold.
          </QuestionResponse>
          <QuestionResponse
            question="Que se passe t'il si l'argent qui est sous gestion dépasse la limite de mon plan ?"
            setQuestionSelected={setQuestionSelected}
            num={2}
            show={questionSelected === 2 ? true : false}
          >
            Dans ce cas les sommes supérieur au maximum pris en compte par votre plan ne sont pas gérées et les stratégies continuent de travailler avec le montant maximum.
            <br />
            Par exemple imaginons que vous optez pour le plan Bronze qui gère jusqu'a 1000$. Votre portefeuille atteint une somme de 1050$, dans ce cas les 50$ d'exedent sont alors convertis en $,
            puis ignoré par la stratégie. La stratégie continuera de trader avec 1000$.
            <br />
            Nous conseillons alors de prendre vos plus values ou bien de passer au plan supérieur.
          </QuestionResponse>
          <QuestionResponse question='Pourquoi les sommes maximales sont elles en dollar ?' setQuestionSelected={setQuestionSelected} num={3} show={questionSelected === 3 ? true : false}>
            Les strategies tradent principalement les paires suivante:
            <br />
            Tether, Bitcoin et Ethereum.
            <br />
            Le Tether est une cryptomonnaie qui imite le dollar, cela donne donc 1$ = 1tether.
            <br />
            Quand nous parlons de dollar, nous parlons en fait de tether. Actuellement ce sont les paires les plus courantes et donc faciles à utiliser. Nous évitons ainsi beaucoup de frais annexes
            que nous aurions en passant par les monnaies classiques comme le dollar ou l'euro.
            <br />
            Ces frais auraient alors été payé par l'utilisateur, donc vous.
          </QuestionResponse>
          <QuestionResponse
            question="Je suis interessé par les rendements mais je n'ai aucune confiance au fait de laisser mon argent à n'importe qui, quel garanti ai-je?"
            setQuestionSelected={setQuestionSelected}
            num={4}
            show={questionSelected === 4 ? true : false}
          >
            Le nombre d'histoire de sommes dérobées sur internet ou de site obscur promettant de fort rendement ne manque pas, cependant ces situations se produisent toujours par manque de
            connaissance de l'utilisateur. Pour ma part je ne laisserais pas non plus mon argent à n'importe qui.
            <br />
            Ce que nos strategies font, c'est de passer des ordres d'achat ou de vente à votre place, mais à aucun moment les sommes sont détenue par nous.
            <br />
            En effet les sommes sont toujours détenues par la platform, c'est à dire Binance, et celle-ci nous permet juste de nous connecter en votre nom grâce a vos clés privée et publique que vous
            devez entrer. Ces clés peuvent être revoqué a tout moment en passant directement par Binance, ce qui empêcherait nos strategies d'effectuer quelcquonque action sur votre compte.
            <br />
            Plus d'information sur les clés dans la section Aide.
          </QuestionResponse>
          <QuestionResponse question="Qu'est ce que font exactement vos strategies ?" setQuestionSelected={setQuestionSelected} num={5} show={questionSelected === 5 ? true : false}>
            Il existe plusieurs sortes de strategie, certaines sont du hight frequency, d'autre du low frequency et d'autre du very low frequency.
            <br />
            Pour l'instant, ce que nous proposons est du low frequency.
            <br />
            Nos strategies passent au maximum un ordre par jour et par strategie. Le low frequency a ses avantages et ses defaults.
            <br />
            Il a l'avantage d'éviter les bruits de marché, c'est-à-dire de multiplier les ordres, évitant ainsi beaucoup de frais de trading qui viendraient rogner les performances réalisées.
            Également, il surf sur de grosses tendences, le rendant fiable dans le temps. Elles l'ont d'ailleur prouvé sur ces 3 dernières années sur le marché des cryptomonnaies.
            <br />
            Pour les inconvenients, il se passe toujours un délai entre le retournement d'une tendance et la coupe des positions par la stratégie. Cela veut donc dire que la stratégie ne peut pas
            capturer la totalité de la tendance. En pratique votre portefeuille grossira à hauteur de la tendence puis prendra des pertes dues au retournement de celle-ci, puis coupera ses positions.
            Cela est tout a fait normal.
            <br />
            Le low frequency signifie faible fréquence, il faut donc avoir un horizon de temps au moment d'investir plus élevé que du high frequency.
          </QuestionResponse>
          <QuestionResponse question='Combien de temps dois-je investir ?' setQuestionSelected={setQuestionSelected} num={6} show={questionSelected === 6 ? true : false}>
            Comme expliqué plus haut, le low frequency demande d'être investi plus longtemps que du high frequency, mais ne veut absolument pas dire moins de rendement, c'est même bien souvent le
            contraire, d'où notre choix pour du low.
            <br />
            En ayant bien conscience de cela, une durée très minimale serait de 3 mois au moins mais les performances sont plutôt mesurées à l'année.
            <br />
            Pour cause, il est très important de comprendre le comportement des marchés.
            <br />
            Ceux-ci ne fonctionnent pas à notre bon vouloir, délivrant des performances régulières et lissées dans le temps. Non, les marchés fonctionnent plutôt par compression/décompression, leurs
            prix peuvent ainsi ne plus varier sur une periode de temps plus moins longue puis partir sur une forte tendance au moment de la decompression. Dans la pratique cela peut se traduire par
            une année avec peu de performance et tout délivrer en 4 mois.
            <br />
            Cette temporalisation des marchés, contre intuitive pour l'être humain est l'une des principales causes de perte des traders, notamment les debutants qui par ennuient ou impression de ne
            pas agir veulent entrer en position quand les marchés ne s'y prêtent pas.
            <br />
            Tout l'intérêt d'un robot est d'ailleurs celui-là. Il n'est pas doté d'émotions, ne fait donc jamais preuve d'impatience, ne panique pas au moins retournement des prix ou ni même n'est
            tentée de prendre toujours plus de risque par cupidité.
            <br />
            Néanmoins vous restez, pour votre part, un être émotif et impatient et avez le contrôle de couper la stratégie par manque de patience, après avoir eu une intuition personnelle ou suite à
            l'avis d'un tiers sur les medias.
            <br />
            Reste donc à vous seul de prendre la décision d'arrêter la stratégie avant l'année conseillée.
          </QuestionResponse>
          <QuestionResponse question='Puis-je perdre la totalité de la somme investit ?' setQuestionSelected={setQuestionSelected} num={7} show={questionSelected === 7 ? true : false}>
            Biensure nous ne prétendons pas connaitre l'avenir et vous affirmer non d'aplomb, mais cela est très peu probable.
            <br />
            Le seul véritable risque de perdre l'intégralité de sa somme serait de mettre de l'effet de levier, et encore un levier élévé. Pour l'instant nous ne proposons pas d'effet de levier, il
            faudrait donc, pour perdre sa mise, deux choses :<br />
            1. Que la stratégie reste investie, par exemple sur du Bitcoin, sans qu'elle ne coupe ses positions.
            <br />
            2. Que le Bitcoin descende jusqu'à atteindre les 0. Autant vous le dire tout de suite, les stratégies sont prévues pour couper leurs positions en cas de retournement, limitant ainsi les
            pertes, et nous croyons fortement dans la valeur du Bitcoin. Cela nous semble donc vraiment très peu probable.
            <br />
            Il est a noter le comportement des prix du Bitcoin depuis ses débuts. Il ne cesse d'évoluer en bulle, c'est-à-dire de gonfler très fortement en prix pour ensuite se dégonfler et
            redescendre sur des prix plus coherents mais néanmoins supérieurs au prix d'avant bulle. Le cycle se répète ainsi depuis sa création et c'est pourquoi même si nous croyons fortement en sa
            valeur sur le très long terme, nous ne pouvons nous permettre d'être exposé à ces cycles qui croyez moi, sont très euphorisant en hausse, déprimante durant les baisses, et ennuyante durant
            les stagnations. Pour être personnellment investi dans nos strategies et aussi garder des cryptomonnaies sans y toucher sur du long terme, les strategies offrent bien plus de confort
            mental en étant tout de même investi dans ce formidable marché.
          </QuestionResponse>
          <QuestionResponse question='Combien puis-je espérer gagner par mois ?' setQuestionSelected={setQuestionSelected} num={8} show={questionSelected === 8 ? true : false}>
            Comme expliqué plus haut, les marchés offrent des performances de façon totalement inconstante, pouvant contracter la majeure partie de ses rendements sur une courte période puis continuée
            par un long fleuve tranquille pendant plusieurs mois.
            <br />
            De ce fait le rendement entre deux personnes ayant investi exactement la même somme, sur une même durée de temps, peut être très different selon la période à laquelle elles sont entré dans
            le marché.
            <br />
            La meilleure réponse est que cela se traduit en pourcentage, forcement une personne avec un plus gros budget aurait de plus gros gains qu'un petit portefeuille. L'évolution au jour le jour
            est directement affichée dans la section stratégie, où un graphique montre l'évolution sur une année, un pourcentage annuelle est affiché.
            <br />
            Sachez quand 3 4 ans d'analyse de signaux, ceux-ci ont délivré un gros rendement en pleine période de bulle et ont pris de petites pertes au moment de l'éclatement de celle-ci. Vous
            resteriez fortement en gain en ayant pris toutes les montées précédentes, l'exercice consistant surtout à éviter d'entrer pile au moment de l'éclatement d'une bulle.
            <br />
            Pour la stratégie qui trade aussi en négatif, qui veut dire qui prend des positions vendeuse et sont donc capables de gagner même en cas de perte des marchés, a délivré un rendement
            supérieur a 100% alors que les marchés s'effondraient. Ces strategie seront bientôt disponibles sur la platform.
          </QuestionResponse>
          <QuestionResponse question="Puis-je changer de plan au milieu d'un mois en cours ?" setQuestionSelected={setQuestionSelected} num={9} show={questionSelected === 9 ? true : false}>
            Pas pour le moment, si vous atteignez votre limite dans le courant du mois et que vous voulez passer au plan supérieur, vous devrez alors attendre que le mois se termine.
            <br /> Nous espérons bientôt prendre en compte ces cas de figure mais pour le moment soyez attentif au plan choisi par rapport à votre somme investi.
            <br />
            Si toutefois cette limite était atteinte, la stratégie continuerait tout de même de s'appliquer à hauteur de la limite et l'exédent serait converti en dollars puis ignoré par la stratégie.
          </QuestionResponse>
          <QuestionResponse question='Dois-je payer tous les mois ?' setQuestionSelected={setQuestionSelected} num={10} show={questionSelected === 10 ? true : false}>
            Oui, nous proposerons par la suite de payer plusieurs mois d'avance et de prévoir un délai pour les personnes ayant oublié de renouveler, mais pour le moment vous devez vous réabonner le
            jour de la fin de l'abonnement.
            <br /> Nous sommes conscients que cela peut être fastidieux ou sujet à oubli et espérons pallier à cela le plus rapidement possible.
            <br />
            Si toutefois l'abonnement n'est pas renouvelé et que des stratégies sont en cours, les sommes seraient alors convertis en dollars pour protéger contre toute fluctuation puis les stratégies
            se couperaient d'elle-même.
          </QuestionResponse>
          <QuestionResponse question='Remboursez-vous si je ne suis pas satisfait ?' setQuestionSelected={setQuestionSelected} num={11} show={questionSelected === 11 ? true : false}>
            Oui, si nos stratégies ne vous conviennent pas nous remboursons le mois en cours. Bien sûr il faut que vous demandiez le remboursement durant le mois en cours. Tout mois fini ne pourra
            plus être remboursé car consommé entièrement.
            <br />
            Pour un remboursmemnt, il suffit de nous envoyer un mail. Nous essayons d'y répondre dans un delais maximum de 24h.
          </QuestionResponse>
          <QuestionResponse question='Comment investir, où dois-je garder mon argent ?' setQuestionSelected={setQuestionSelected} num={12} show={questionSelected === 12 ? true : false}>
            Comme expliqué plus haut, notre rôle est seulement d'envoyer des ordres d'achat ou de vente, et non de gérer directement votre argent.
            <br />
            Pour investir, nous travaillons pour le moment avec la platform{' '}
            <a href='https://www.binance.com/fr' target='blank'>
              Binance
            </a>{' '}
            sur laquelle vous devez déposer vos sommes.
            <br />
            Pour le montant, nous prenons en compte seulement les sommes convertit en USDT(aussi appelé Tether). Toute autre devise ne sera pas prise en compte en n'apparaîtra pas comme montant
            disponible sur notre platform.
            <br />
            Pour plus d'explication nous vous invitons à aller dans la section Aide.
          </QuestionResponse>
          <QuestionResponse question='La platform Binance est-elle fiable ?' setQuestionSelected={setQuestionSelected} num={13} show={questionSelected === 13 ? true : false}>
            Nous avons choisi de travailler avec la platform Binance car celle-ci est certainement l'une des plus fiables.
            <br />
            Elle permet d'effectuer la double authentification, applique toutes les règles de législation, notamment le KYC, est présente dans plusieurs pays dans le monde dont les Etats-Unis, la
            chine... et projète même d'installer une structure en France.
            <br />
            Elle possède également un fond d'assurance élevé qui permet de rembourser d'éventuelle perte d'argent qui pourrait être due a un vol.
            <br />
            Elle l'a d'ailleurs déjà prouvé par le passé ou 7000 Bitcoins ont été derobé. Binance a tout de suite essuyé les pertes sans difficulté, et tout cela est resté transparent pour les
            utilisateurs.
            <br />
            En cas de fort trafic, Binance a également prouvé qu'elle pouvait prendre les grosses montées en charge de requêtes sans interruption de leurs services, ce qui n'est pas le cas de toutes
            les platforms.
            <br />
            En prenant en plus en compte les frais de trading, qui en font une, voir la platform la moins chère, Binance est naturellement apparu comme notre premier choix. Nous souhaitons par la
            suite intégrer la platform Kraken.
          </QuestionResponse>
          <QuestionResponse question="Puis-je retirer l'argent quand je le veux ?" setQuestionSelected={setQuestionSelected} num={14} show={questionSelected === 14 ? true : false}>
            Oui, bien évidemment. Les stratégies ne font que passer des ordres, ainsi vous pouvez couper ces ordres à tout moment dans la section stratégie.
            <br />
            Les sommes alors présente sur Binance peuvent être envoyés sur votre compte en banque directement depuis cette platform.
            <br />
            Une fois la demande de virement effectué, cela peut varier mais prend généralement entre 1 et 3 jours. Pour plus de detail, il faut se rendre sur <a href='https://www.binance.com/fr/my/wallet/account/main/withdrawal/fiat/EUR' target='blank'>Binance</a> dans "Compte principal" puis "Retrait".
          </QuestionResponse>
          <QuestionResponse question="Qui êtes-vous ? Comment sont construites vos stratégies, avez-vous beaucoup d'expérience dans le trading ?" setQuestionSelected={setQuestionSelected} num={15} show={questionSelected === 15 ? true : false}>
            Nous ne générons pas directement les signaux. Ceux-ci sont générés par une société externe dans laquelle nous avons investi, qui fournit des signaux d'achat/vente depuis milieu 2017.<br/>
            Cette société travaille avec de grosses quantités de données afin de les analyser et d'en ressortir une tendance qui sera 
            retranscrite sous forme de signal haussier, baissier ou neutre.<br/>
            Analyser toutes ces donnés est impossible pour un être humain et demande de grande compétence afin de délivrer une stratégie fiable
            et pérenne dans le temps.<br/>
            Chose à laquelle nous avons assisté durant une longue période allant de milieu 2017 à aujourd'hui.<br/>
            Si vous n'êtes pas familier du milieu des cryptomonnaies, sachez que celles-ci sont disruptives
            et contribuent à lever des barrières entre des milieux qui jusqu'alors n'était pas imaginable.<br/>
            Ces signaux en sont un exemple car jusqu'ici réservé au milieu des grandes banques, fonds ou edge funds.<br/>
            D'ailleurs les createurs de ses signaux viennent directement de ces milieux, attirés par ce nouveau paradigme qu'offrent les cryptomonnaies.<br/>
            Étant personnellement investisseur, donc ayant accès à ces signaux et developpeur, nous avons donc décidé de réunir les deux
            afin d'automatiser les prises de positions.<br/>
            Très vite les signaux se sont montré très lucratifs et avons rapidement été amenés à faire de même pour notre entourage.<br/>
            Les demandes grandissantes, nous avons donc décidé de créer cette platform afin que d'autres puissent en bénéficier sans que nous ayons personnellement besoin
            de réexpliquer toutes les subtilités et procédure.<br/>
            Pour le moment en tout cas, cette platform n'a pas vocation à grossir et géré beaucoup de personnes, ce qui est plus compliqué que de gérer
            un nombre limité de personnes. J'aurais alors à recruter augmentant le coup des stratégies mensuelles.
          </QuestionResponse>
          <QuestionResponse question="Quand vous parlez de limite de personne, quelle est-elle et que se passe-t-il si cette limite est atteinte ?" setQuestionSelected={setQuestionSelected} num={16} show={questionSelected === 16 ? true : false}>
            Cela depend en partit du type de personne qui utilise notre solution, et plus plus précisémment des sommes investies.<br/>
            En effet il est beaucoup plus difficile de coordonner de grosse quantité de capitaux plutôt que de petite. Dans un souci de
            qualité de service, utilisant nous-mêmes nos propres stratégies, nous souhaitons garder un service optimum avec une limite de 100 personnes
            utilisant nos stratégies.<br/>
            Si cette limite devait être atteinte nous fermerions dès lors les inscriptions.<br/>
            Cela pourrait expliquer si tel est votre cas pourquoi vous avez pu vous inscrire mais pas une personne à laquelle vous auriez recommandé
            de vous inscrire.<br/>
            Dans ce cas-là le mieux serait de nous envoyer un mail afin de mettre cette personne sur liste d'attente jusqu'à ce qu'un autre utilisateur coupe ses strategie,
            dans quel cas nous inscririons cette personne a la place.
          </QuestionResponse>
        </ul>
      </div>
    </div>
  );
}
