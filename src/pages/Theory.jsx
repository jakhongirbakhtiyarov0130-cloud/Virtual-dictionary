import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../App.css';

import Logo from "/images/logo.png"

// Icons
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconBookOpen = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconPlay = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;

const Theory = () => {
    const { user } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [activeLesson, setActiveLesson] = useState(null);

    const lessons = [
        {
            id: 1,
            title: "Musiqa nima? Tovushlarning xususiyatlari",
            desc: "Musiqa san'atining asosiy tushunchalari va tovush fizikasi.",
            content: `
            <h3>Musiqa haqida tushuncha</h3>
            <p>Musiqa — (yunoncha ”musike” — ilhom parilari sanʼati) — inson his-tuygʻulari, orzu-intilishlari va fikrlarini badiiy musiqiy obrazlarda aks ettiruvchi tovushli sanʼat turi.</p>
            <p>Bizni o'rab turgan olam turli xil tovushlarga to'la. Shamolning shovullashi, qushlarning sayrashi, momaqaldiroq gumburlashi, mashinalar shovqini — bularning barchasi tovushlardir.</p>

            <h3>Tovush turlari</h3>
            <p>Tabiatdagi barcha tovushlar ikki guruhga bo'linadi:</p>
            <ul>
                <li><strong>Musiqiy tovushlar:</strong> Aniq balandlikka ega bo'lgan, kuylash yoki cholg'uda chalish mumkin bo'lgan tovushlar.</li>
                <li><strong>Shovqinlar:</strong> Aniq balandlikka ega bo'lmagan tovushlar (qarsak, taqillash, shitirlash).</li>
            </ul>

            <h3>Musiqiy tovushning 4 ta xususiyati</h3>
            <p>Har qanday musiqiy tovush 4 ta fizik xususiyatga ega:</p>
            <ol>
                <li><strong>Balandlik (Pitch):</strong> Tovushning qanchalik ingichka yoki yo'g'onligi. Tebranish chastotasiga bog'liq.</li>
                <li><strong>Qattiqlik (Kuch):</strong> Tovushning qanchalik baland yoki past eshitilishi (dinamika). Tebranish amplitudasiga bog'liq.</li>
                <li><strong>Tembr (Bo'yoq):</strong> Tovushning o'ziga xos "rangi". Masalan, bitta notani pianino va skripkada chalganda farqini aynan tembr orqali ajratamiz.</li>
                <li><strong>Cho'zim (Davomiylik):</strong> Tovushning vaqt davomida qancha yangrashi.</li>
            </ol>
            `
        },
        {
            id: 2,
            title: "Nota yozuvi va Notalar cho'zimi",
            desc: "Notalarning yozilishi va ularning vaqt bo'yicha davomiyligi.",
            content: `
            <h3>Nota nima?</h3>
            <p>Nota (lotincha "belgi") — musiqiy tovushlarni qog'ozda ifodalash uchun ishlatiladigan shartli belgi.</p>
            <p>Asosiy 7 ta nota mavjud: <strong>Do, Re, Mi, Fa, Sol, Lya, Si.</strong></p>

            <h3>Notalar cho'zimi (Ritmik qiymatlar)</h3>
            <p>Notalar qancha vaqt yangrashiga qarab turli shakllarda yoziladi:</p>
            <ul>
                <li><strong>Butun nota (1):</strong> Eng uzun nota, 4 sanaguncha davom etadi. (Yozilishi: ichi bo'sh oval)</li>
                <li><strong>Yarim nota (1/2):</strong> Butun notaning yarmi, 2 sanaguncha davom etadi. (Yozilishi: ichi bo'sh oval va tayoqcha)</li>
                <li><strong>Chorak nota (1/4):</strong> Yarim notaning yarmi, 1 sanaguncha davom etadi. (Yozilishi: ichi to'la oval va tayoqcha)</li>
                <li><strong>Nimchorak nota (1/8):</strong> Chorak notaning yarmi, 0.5 sanaguncha davom etadi. (Yozilishi: tayoqchada bitta dumcha bor)</li>
                <li><strong>O'n oltitalik nota (1/16):</strong> Nimchorakning yarmi. (Yozilishi: tayoqchada ikkita dumcha bor)</li>
            </ul>
            <p>Bu cho'zimlar musiqaning ritmik asosini tashkil qiladi.</p>
            `
        },
        {
            id: 3,
            title: "Nota yo'li va Kalitlar",
            desc: "Skripka va Bass kalitlari, nota yo'lida notalarning joylashuvi.",
            content: `
            <h3>Nota yo'li (Notanosec)</h3>
            <p>Notalar 5 ta parallel chiziqdan iborat <strong>nota yo'li</strong>ga yoziladi. Chiziqlar pastdan yuqoriga qarab sanaladi (1, 2, 3, 4, 5).</p>
            <p>Notalar chiziq ustida, chiziqlar orasida, hamda qo'shimcha chiziqlarda yozilishi mumkin.</p>

            <h3>Musiqiy Kalitlar</h3>
            <p>Kalit — nota yo'lining boshida qo'yiladigan belgi bo'lib, u notalarning balandligini belgilab beradi.</p>
            
            <h4>Skripka kaliti (Sol kaliti)</h4>
            <p>Eng ko'p tarqalgan kalit. U 2-chiziqda joylashgan notani <strong>Sol</strong> (birinchi oktava) deb belgilaydi. Ayollar ovozi, skripka, pianinoning o'ng qo'l qismi uchun ishlatiladi.</p>

            <h4>Bass kaliti (Fa kaliti)</h4>
            <p>Past ovozlar uchun ishlatiladi. U 4-chiziqda joylashgan notani <strong>Fa</strong> (kichik oktava) deb belgilaydi. Erkaklar ovozi, violonchel, pianinoning chap qo'l qismi uchun ishlatiladi.</p>

            <h4>Oktava tizimi</h4>
            <p>Musiqiy tovushqator oktavalarga bo'linadi: Subkontr, Kontr, Katta, Kichik, 1-oktava, 2-oktava, 3-oktava, 4-oktava va 5-oktava.</p>
            `
        },
        {
            id: 4,
            title: "Ton va Yarim ton. Alteratsiya",
            desc: "Tovushlarning baland-pastligi va o'zgarish belgilari (diez, bemol).",
            content: `
            <h3>Yarim ton va Ton</h3>
            <p><strong>Yarim ton:</strong> Musiqadagi ikki tovush orasidagi eng qisqa masofa. Fortepianoda bu ikkita qo'shni tugma (oq va qora yoki ikkita oq) orasidagi masofadir.</p>
            <p><strong>Ton:</strong> Ikkita yarim ton yig'indisi. (Masalan: Do va Re orasida qora tugma bor, demak Do-Re oralig'i 1 ton).</p>

            <h3>Alteratsiya belgilari</h3>
            <p>Alteratsiya — asosiy tovushning balandligini o'zgartirish (balandlatish yoki pasaytirish) demakdir.</p>
            <ul>
                <li><strong>Diez (#):</strong> Tovushni yarim ton <em>ko'taradi</em>.</li>
                <li><strong>Bemol (b):</strong> Tovushni yarim ton <em>pasaytiradi</em>.</li>
                <li><strong>Bekar:</strong> Oldingi qo'yilgan Diez yoki Bemol ta'sirini <em>bekor qiladi</em>.</li>
                <li><strong>Dubl-diez (x):</strong> Tovushni 1 ton (ikkita yarim ton) ko'taradi.</li>
                <li><strong>Dubl-bemol (bb):</strong> Tovushni 1 ton pasaytiradi.</li>
            </ul>
            <p>Masalan: Do# (Do-diez) bu Do notasidan yarim ton baland tovush.</p>
            `
        },
        {
            id: 5,
            title: "Ritm va Metr",
            desc: "Musiqiy vaqt, kuchli va kuchsiz hissalar.",
            content: `
            <h3>Musiqiy Puls</h3>
            <p>Yurak urishi kabi, musiqaning ham o'z pulsi bor. Bu bir tekisda davom etuvchi urishlardir.</p>

            <h3>Metr</h3>
            <p>Metr — bu kuchli va kuchsiz hissalar (urishlar)ning davriy almashinuvi. Masalan, "birlam-ikkilam" (kuchli-kuchsiz) bu marshga xos metr.</p>

            <h3>Ritm</h3>
            <p>Ritm — bu musiqiy tovushlarning vaqt ichidagi tashkiliy tuzilmasi. Ritm uzun va qisqa notalarning ketma-ketligidan hosil bo'ladi.</p>
            <p>Metr bu qolip bo'lsa, ritm bu shu qolip ichidagi naqshdir.</p>
            `
        },
        {
            id: 6,
            title: "O'lchovlar va Taktlar",
            desc: "2/4, 3/4, 4/4 o'lchovlari va dirijyorlik sxemalari.",
            content: `
            <h3>Takt</h3>
            <p>Takt — bu bir kuchli hissadan keyingi kuchli hissagacha bo'lgan musiqa parchasi. Taktlar nota yo'lida vertikal chiziq (takt chizig'i) bilan ajratiladi.</p>

            <h3>O'lchov (Size)</h3>
            <p>O'lchov kasr ko'rinishida yoziladi (masalan, 2/4, 3/4, 4/4) va asar boshida kalitdan keyin qo'yiladi.</p>
            <ul>
                <li><strong>Yuqori raqam:</strong> Takt ichida nechta hissa borligini bildiradi.</li>
                <li><strong>Pastki raqam:</strong> Har bir hissa qanday cho'zimga teng ekanligini bildiradi (4 — chorak, 8 — nimchorak).</li>
            </ul>

            <h4>Asosiy o'lchovlar:</h4>
            <ul>
                <li><strong>2/4:</strong> Ikki hissali (Bir-ikki). Marshlar uchun xos.</li>
                <li><strong>3/4:</strong> Uch hissali (Bir-ikki-uch). Vals raqsi uchun xos.</li>
                <li><strong>4/4:</strong> To'rt hissali (S, C belgisi bilan ham yoziladi). Pop, rok va klassik musiqada keng tarqalgan.</li>
            </ul>
            `
        },
        {
            id: 7,
            title: "Temp va Dinamika",
            desc: "Musiqa tezligi va tovush kuchi (piano, forte).",
            content: `
            <h3>Temp</h3>
            <p>Temp — musiqiy asarning ijro etilish tezligi. Templar asosan italyan tilida ifodalanadi:</p>
            <ul>
                <li><strong>Largo:</strong> Judat sekin va keng.</li>
                <li><strong>Adagio (Adajio):</strong> Sekin, xotirjam.</li>
                <li><strong>Andante:</strong> O'rtacha sekin (yurish tezligida).</li>
                <li><strong>Moderato:</strong> O'rtacha tezlikda.</li>
                <li><strong>Allegro:</strong> Tez, sho'x.</li>
                <li><strong>Presto:</strong> Juda tez.</li>
            </ul>

            <h3>Dinamika</h3>
            <p>Dinamika — tovushning kuchayishi yoki pasayishi.</p>
            <ul>
                <li><strong>Piano (p):</strong> Sekin, past ovozda.</li>
                <li><strong>Forte (f):</strong> Kuchli, baland ovozda.</li>
                <li><strong>Mezzo piano (mp):</strong> O'rtacha sekin.</li>
                <li><strong>Mezzo forte (mf):</strong> O'rtacha kuchli.</li>
                <li><strong>Crescendo (cresc. <):</strong> Ovozni kuchaytirib borish.</li>
                <li><strong>Diminuendo (dim. >):</strong> Ovozni pasaytirib borish.</li>
            </ul>
            `
        },
        {
            id: 8,
            title: "Intervallar: Sodda intervallar",
            desc: "Prima, sekunda, tersiya va boshqa intervallar.",
            content: `
            <h3>Interval nima?</h3>
            <p>Interval — (lotincha "oraliq") ikki tovush orasidagi balandlik masofasi.
            Pastki tovush — <em>asos</em>, yuqori tovush — <em>cho'qqi</em> deb ataladi.</p>

            <h3>Sodda intervallar (bir oktava ichida):</h3>
            <p>Intervallar raqamlar bilan belgilanadi (lotincha tartib raqamlari):</p>
            <ul>
                <li>1. <strong>Prima:</strong> 1 pog'ona (bir xil tovushning takrori).</li>
                <li>2. <strong>Sekunda:</strong> 2 pog'ona oralig'i.</li>
                <li>3. <strong>Tersiya:</strong> 3 pog'ona oralig'i.</li>
                <li>4. <strong>Kvarta:</strong> 4 pog'ona oralig'i.</li>
                <li>5. <strong>Kvinta:</strong> 5 pog'ona oralig'i.</li>
                <li>6. <strong>Seksta:</strong> 6 pog'ona oralig'i.</li>
                <li>7. <strong>Septima:</strong> 7 pog'ona oralig'i.</li>
                <li>8. <strong>Oktava:</strong> 8 pog'ona oralig'i.</li>
            </ul>
            `
        },
        {
            id: 9,
            title: "Intervallar: Kengaytirilgan",
            desc: "Sof, katta, kichik, orttirilgan va kamaytirulgan intervallar.",
            content: `
            <h3>Interval Sifati</h3>
            <p>Intervallar nafaqat pog'onalar soni bilan, balki ularning ichidagi tonlar soni bilan ham farqlanadi. Ular <strong>Sof, Katta, Kichik, Orttirilgan</strong> va <strong>Kamaytirulgan</strong> bo'lishi mumkin.</p>

            <ul>
                <li><strong>Sof intervallar:</strong> Prima, Kvarta, Kvinta, Oktava. (Masalan: Sof Kvinta - 3.5 ton).</li>
                <li><strong>Katta va Kichik intervallar:</strong> Sekunda, Tersiya, Seksta, Septima.</li>
            </ul>
            <p>Masalan:</p>
            <ul>
                <li><strong>Katta Tersiya (b.3):</strong> 2 ton. (Masalan: Do-Mi)</li>
                <li><strong>Kichik Tersiya (k.3):</strong> 1.5 ton. (Masalan: Do-Mi bemol) — bu interval mungli eshitiladi.</li>
            </ul>
            <p><strong>Triton:</strong> 3 tondan iborat interval (orttirilgan kvarta yoki kamaytirulgan kvinta). Juda keskin eshitiladi.</p>
            `
        },
        {
            id: 10,
            title: "Ladlar: Major va Minor",
            desc: "Musiqiy ladlarning tuzilishi va turlari.",
            content: `
            <h3>Lad nima?</h3>
            <p>Lad — musiqadagi barqaror (tayanch) va beqaror tovushlarning o'zaro bog'liqligi. Eng asosiy barqaror tovush <strong>Tonika</strong> deb ataladi.</p>

            <h3>Major (Katta)</h3>
            <p>Major ladi quvnoq, yorug', tantanali eshitiladi.
            <br>Tuzilishi (formula): <strong>Ton - Ton - Yarim ton - Ton - Ton - Ton - Yarim ton</strong>.</p>

            <h3>Minor (Kichik)</h3>
            <p>Minor ladi mungli, yumshoq, lirik eshitiladi.
            <br>Tuzilishi (formula): <strong>Ton - Yarim ton - Ton - Ton - Yarim ton - Ton - Ton</strong>.</p>
            <p>Aksariyat musiqalar shu ikki lad asosida yoziladi ("Dur" - Major, "Moll" - Minor).</p>
            `
        },
        {
            id: 11,
            title: "Tonallik va Gamma",
            desc: "Tonalliklar doirasi va gammalar ijrosi.",
            content: `
            <h3>Gamma</h3>
            <p>Gamma — bu lad tovushlarining balandlik bo'yicha (pastdan yuqoriga yoki aksincha) bir oktava davomida ketma-ket joylashishi.</p>
            <p>Masalan: <strong>Do major gammasi:</strong> Do, Re, Mi, Fa, Sol, Lya, Si, Do.</p>

            <h3>Tonallik</h3>
            <p>Tonallik — bu ladning aniq bir balandlikdagi o'rni. Tonallik nomi Tonika (asosiy tovush) va Lad (Major/Minor) nomidan tashkil topadi.
            <br>Masalan: <em>Re major</em> (Tonikasi Re, ladi Major), <em>Lya minor</em> (Tonikasi Lya, ladi Minor).</p>

            <h3>Parallel tonalliklar</h3>
            <p>Belgilari bir xil bo'lgan, lekin tonikasi farq qiluvchi Major va Minor tonalliklari. (Masalan: Do major va Lya minor — ikkalisida ham belgilar yo'q).</p>
            `
        },
        {
            id: 12,
            title: "Akkordlar: Uch tovushliklar",
            desc: "Major va Minor uch tovushliklari.",
            content: `
            <h3>Akkord</h3>
            <p>Akkord — uch yoki undan ortiq tovushlarning bir vaqtda (yoki ketma-ket) eshitilishi.</p>

            <h3>Uch tovushlik (Triada)</h3>
            <p>Tersiya oralig'ida joylashgan uchta tovushdan iborat akkord.</p>
            <ul>
                <li><strong>Major uch tovushligi (B53):</strong> Katta tersiya + Kichik tersiya. (Masalan: Do-Mi-Sol). Yorug' eshitiladi.</li>
                <li><strong>Minor uch tovushligi (M53):</strong> Kichik tersiya + Katta tersiya. (Masalan: Do-Mi bemol-Sol). Mungli eshitiladi.</li>
            </ul>
            <p>Akkordlar musiqaning garmonik asosini tashkil etadi.</p>
            `
        },
        {
            id: 13,
            title: "Akkordlar aylanmasi",
            desc: "Sekstakkord va kvartsekstakkordlar.",
            content: `
            <h3>Aylanma nima?</h3>
            <p>Akkordning pastki tovushini (basni) yuqoriga bir oktavaga ko'chirish natijasida hosil bo'lgan yangi akkordga aylanma deyiladi.</p>

            <h3>Uch tovushlikning aylanmalari</h3>
            <ol>
                <li><strong>Asosiy korinish (53):</strong> (Do-Mi-Sol)</li>
                <li><strong>Sekstakkord (6):</strong> Birinchi aylanma. Pastki tovush (Do) yuqoriga o'tadi. (Mi-Sol-Do).</li>
                <li><strong>Kvartsekstakkord (64):</strong> Ikkinchi aylanma. Endi Mi yuqoriga o'tadi. (Sol-Do-Mi).</li>
            </ol>
            <p>Aylanmalar akkordning yangrash tusini o'zgartiradi va musiqani ravon bog'lashga yordam beradi.</p>
            `
        },
        {
            id: 14,
            title: "Septakkordlar",
            desc: "Dominant septakkord va uning aylanmalari.",
            content: `
            <h3>Septakkord (7)</h3>
            <p>Tersiya bo'ylab joylashgan to'rtta tovushdan iborat akkord. Uning chetki tovushlari orasi septima bo'lgani uchun shunday ataladi.</p>

            <h3>Dominant Septakkord (D7)</h3>
            <p>Eng ko'p ishlatiladigan septakkord. U major ladining V pog'onasidan (Dominanta) tuziladi.</p>
            <p>Tuzilishi: Katta tersiya + Kichik tersiya + Kichik tersiya. (Masalan: Sol-Si-Re-Fa).
            <br>Bu akkord juda tarang eshitiladi va Tonikaga (yechimga) intiladi.</p>
            `
        },
        {
            id: 15,
            title: "Melodiya va Garmoniya",
            desc: "Musiqaning horizontall va vertikal tuzilishi.",
            content: `
            <h3>Melodiya</h3>
            <p>Melodiya (kuy) — musiqaning "qalb"i. Bu bir ovozli musiqiy fikr bo'lib, lad va ritm asosida tashkil topgan tovushlar ketma-ketligidir. Melodiya gorizontal yo'nalishda rivojlanadi.</p>

            <h3>Garmoniya</h3>
            <p>Garmoniya — bu musiqaning vertikal tuzilishi. U kuyni jo'r bo'lib bezab turuvchi akkordlar va ovozlar yig'indisidir. Garmoniya kuyga chuqurlik, hajm va his-tuyg'u bo'yog'ini beradi.</p>
            <p>Oddiy qilib aytganda: Melodiya — bu siz hirgoyi qiladigan narsa, Garmoniya — bu uning orqasidagi fon musiqasi.</p>
            `
        },
        {
            id: 16,
            title: "Musiqiy bezaklar (Melizmlar)",
            desc: "Trill, mordent, gruppetto va forshlag.",
            content: `
            <h3>Melizmlar</h3>
            <p>Melizmlar — asosiy kuyga ziynat beruvchi mayda notalar va bezaklar.</p>
            <ul>
                <li><strong>Forshlag:</strong> Asosiy notadan oldin keladigan juda qisqa bezak nota.</li>
                <li><strong>Trill (tr):</strong> Ikkita qo'shni notaning tez almashinishi.</li>
                <li><strong>Mordent:</strong> Asosiy nota, uning qo'shnisi va yana asosiy notaning tez ijrosi.</li>
                <li><strong>Gruppetto:</strong> Asosiy notani yuqori va pastki qo'shnilari bilan "o'rab olish".</li>
            </ul>
            <p>Melizmlar musiqaga nafislik va virtuozlik bag'ishlaydi. Barokko davri musiqasida (Bax, Vivaldi) juda ko'p uchraydi.</p>
            `
        },
        {
            id: 17,
            title: "Musiqiy shakl va janrlar",
            desc: "Qo'shiq, rondo, variatsiya va sonata shakllari.",
            content: `
            <h3>Musiqiy Shakl</h3>
            <p>Binoning loyihasi bo'lganidek, musiqiy asarning ham qurilish rejasi bor. Bu musiqiy shakldir.</p>
            <ul>
                <li><strong>Bir qismli shakl (A):</strong> Kichik miniatyuralar.</li>
                <li><strong>Ikki qismli shakl (AB):</strong> Qo'shiq va naqorat (Kuplet-Pripev) shakli.</li>
                <li><strong>Uch qismli shakl (ABA):</strong> Mavzu, o'rta qism va mavzuning qaytishi.</li>
                <li><strong>Rondo (ABACA...):</strong> "Aylana" degani. Bosh mavzu (Refren) boshqa epizodlar bilan almashinib, qayta-qayta keladi.</li>
                <li><strong>Variatsiya (A, A1, A2, A3...):</strong> Bitta mavzuning har xil o'zgartirishlar bilan qaytarilishi.</li>
            </ul>
            `
        },
        {
            id: 18,
            title: "Polifoniya asoslari",
            desc: "Ko'p ovozli musiqa va kontrapunkt.",
            content: `
            <h3>Homofoniya vs Polifoniya</h3>
            <ul>
                <li><strong>Homofoniya:</strong> Bitta yetakchi kuy va unga jo'r bo'luvchi akkordlar (garmoniya). Bugungi kundagi ko'pchilik qo'shiqlar shu turda.</li>
                <li><strong>Polifoniya:</strong> ("Ko'p ovozlilik") Bir vaqtning o'zida bir nechta mustaqil kuylarning yangrashi. Bunda "asosiy" kuy yo'q, hamma ovozlar teng huquqli.</li>
            </ul>

            <h3>Polifoniya turlari</h3>
            <ul>
                <li><strong>Imitatsiya:</strong> Bir ovoz boshlagan kuyni biroz vaqt o'tib boshqa ovoz xuddi o'zida takrorlashi.</li>
                <li><strong>Kanon:</strong> Uzluksiz imitatsiya.</li>
                <li><strong>Fuga:</strong> Polifoniyaning eng murakkab va mukammal shakli. I.S.Bax fuganing buyuk ustasi hisoblanadi.</li>
            </ul>
            `
        },
        {
            id: 19,
            title: "Simfonik orkestr",
            desc: "Orkestr guruhlari va cholg'ulari.",
            content: `
            <h3>Simfonik Orkestr</h3>
            <p>Bu musiqadagi eng katta va boy jamoa. Unda 4 ta asosiy cholg'u guruhi mavjud:</p>
            <ol>
                <li><strong>Torli-kamonli cholg'ular:</strong> Skripka, Alt, Violonchel, Kontrabas. (Orkestrning asosi).</li>
                <li><strong>Yog'och puflama cholg'ular:</strong> Fleyta, Goboy, Klarnet, Fagot.</li>
                <li><strong>Mis puflama cholg'ular:</strong> Valtorna, Truba, Trombon, Tuba. (Eng kuchli ovozli guruh).</li>
                <li><strong>Zarbli cholg'ular:</strong> Litavrlar, Katta baraban, Likopchalar, Uchburchak va h.k.</li>
            </ol>
            <p>Bundan tashqari Arfa va Fortepiano ham qo'shilishi mumkin. Orkestrni <strong>Dirijyor</strong> boshqaradi.</p>
            `
        },
        {
            id: 20,
            title: "Musiqiy tahlil asoslari",
            desc: "Musiqiy asarni tahlil qilishni o'rganish.",
            content: `
            <h3>Asarni tahlil qilish</h3>
            <p>Haqiqiy musiqachi asarni shunchaki tinglamaydi, uni "o'qiydi". Tahlil qilishda quyidagilarga e'tibor berish kerak:</p>
            <ul>
                <li><strong>Xarakteri:</strong> Musiqa qanday kayfiyatda? (G'amgin, sho'x, jangovar, lirik).</li>
                <li><strong>Vositalari:</strong> Qaysi temp, dinamika, lad, metr ishlatilgan?</li>
                <li><strong>Shakli:</strong> Asar qanday tuzilgan? Mavzular necha marta qaytarildi?</li>
                <li><strong>Mazmuni:</strong> Kompozitor bu asar orqali nima demoqchi bo'lgan?</li>
            </ul>
            <p>Musiqa nazariyasini bilish sizga musiqani shunchaki fon sifatida emas, balki chuqur san'at asari sifatida tushunishga yordam beradi.</p>
            <p><strong>Kurs yakunlandi! Tabriklaymiz, endi siz musiqa nazariyasi bo'yicha boshlang'ich bilimlar bazasiga egasiz!</strong></p>
            `
        }
    ];

    return (
        <div className="container" style={{ background: '#f4f7f6', minHeight: '100vh' }}>
            <div className="top-bar">
                <div className="top-bar-left">{t('welcome_portal')}</div>
                <div className="top-bar-info">
                    <span><IconPhone /> +998 (90) 123-45-67</span>
                    <span style={{ marginLeft: '25px' }}><IconMail /> info@libmusic.uz</span>
                </div>
            </div>

            <header className="header">
                <div className="header-left">
                    <div className="title-wrapper">
                        <img src={Logo} alt="Logo" className="site-logo" />
                        <div className="site-title-box">
                            <h1>{t('site_title')}</h1>
                            <p>{t('site_subtitle')}</p>
                        </div>
                    </div>
                </div>
                <div style={{ flex: 1 }}></div>
                <div className="user-nav">
                    <Link to="/profile" className="profile-btn">
                        <IconUser /> {user?.fullname?.split(' ')[0] || "Mehmon"}
                    </Link>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="lang-select">
                        <option value="uz">UZ</option>
                        <option value="ru">RU</option>
                        <option value="kaa">QAA</option>
                    </select>
                </div>
            </header>

            <nav className="main-nav">
                <ul style={{ gap: '20px' }}>
                    <li><Link to="/">{t('dictionary')}</Link></li>
                    <li className="active"><Link to="/theory" style={{ color: 'var(--accent-color)' }}>{t('theory')}</Link></li>
                    <li><Link to="/composers">{t('composers')}</Link></li>
                    <li><Link to="/quiz">{t('quiz')}</Link></li>
                </ul>
            </nav>

            <div className="content-wrapper" style={{ flexDirection: 'column' }}>
                <div className="breadcrumb" style={{ marginBottom: '20px' }}>{t('home')} &gt; {t('theory')}</div>

                <div className="theory-container" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                    {/* Left Sidebar: Lesson List */}
                    <div className="theory-list" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <IconBookOpen /> {t('lesson')}lar
                        </h3>
                        <div style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '5px' }}>
                            {lessons.map((item) => (
                                <div
                                    key={item.id}
                                    className={`premium-card glass ${activeLesson === item.id ? 'active-lesson' : ''}`}
                                    style={{
                                        padding: '20px',
                                        marginBottom: '15px',
                                        background: activeLesson === item.id ? 'var(--accent-color)' : 'white',
                                        color: activeLesson === item.id ? 'white' : '#1e293b',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        borderLeft: `5px solid ${activeLesson === item.id ? 'var(--secondary-color)' : 'transparent'}`,
                                        opacity: activeLesson && activeLesson !== item.id ? 0.7 : 1
                                    }}
                                    onClick={() => setActiveLesson(item.id)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                        <span style={{
                                            background: activeLesson === item.id ? 'rgba(255,255,255,0.2)' : 'var(--accent-color)',
                                            color: 'white',
                                            padding: '3px 10px',
                                            borderRadius: '15px',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase'
                                        }}>
                                            {t('day')} {item.id}
                                        </span>
                                        {activeLesson === item.id ? <IconPlay /> : null}
                                    </div>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '5px', lineHeight: '1.4' }}>{item.title}</h4>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.8, display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="theory-content" style={{ flex: '2 1 500px', minWidth: '300px' }}>
                        {activeLesson ? (
                            <div className="premium-card" style={{ padding: '40px', background: 'white', minHeight: '500px', animation: 'fadeIn 0.5s' }}>
                                {(() => {
                                    const lesson = lessons.find(l => l.id === activeLesson);
                                    return (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                                                <div>
                                                    <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{t('day')} {lesson.id}</span>
                                                    <h1 style={{ fontSize: '2rem', color: '#1e293b', marginTop: '5px', lineHeight: '1.2' }}>{lesson.title}</h1>
                                                </div>
                                                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '50%', color: 'var(--accent-color)' }}>
                                                    <IconBookOpen />
                                                </div>
                                            </div>

                                            <div
                                                className="lesson-body"
                                                style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#334155' }}
                                                dangerouslySetInnerHTML={{ __html: lesson.content }}
                                            />

                                            <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                                                <button
                                                    onClick={() => setActiveLesson(prev => prev > 1 ? prev - 1 : prev)}
                                                    disabled={activeLesson === 1}
                                                    className="action-btn"
                                                    style={{ opacity: activeLesson === 1 ? 0.5 : 1, cursor: activeLesson === 1 ? 'not-allowed' : 'pointer', background: '#e2e8f0', color: '#475569' }}
                                                >
                                                    &larr; Oldingi dars
                                                </button>
                                                <button
                                                    onClick={() => setActiveLesson(prev => prev < lessons.length ? prev + 1 : prev)}
                                                    disabled={activeLesson === lessons.length}
                                                    className="login-btn"
                                                    style={{ width: 'auto', padding: '10px 25px', opacity: activeLesson === lessons.length ? 0.5 : 1, cursor: activeLesson === lessons.length ? 'not-allowed' : 'pointer' }}
                                                >
                                                    Keyingi dars &rarr;
                                                </button>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        ) : (
                            // Welcome State (No lesson selected)
                            <div className="premium-card" style={{
                                padding: '50px',
                                background: 'linear-gradient(135deg, var(--accent-color), var(--secondary-color))',
                                color: 'white',
                                textAlign: 'center',
                                borderRadius: '20px',
                                position: 'relative',
                                overflow: 'hidden',
                                minHeight: '400px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}><IconPlay /></div>
                                    <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{t('theory')}</h2>
                                    <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '30px' }}>
                                        Musiqiy savodxonlik dunyosiga xush kelibsiz! <br />
                                        O'rganishni boshlash uchun chap tomondagi darslardan birini tanlang.
                                    </p>
                                    <button
                                        className="login-btn"
                                        style={{ background: 'white', color: 'var(--accent-color)', width: 'auto', padding: '15px 40px', fontWeight: 'bold' }}
                                        onClick={() => setActiveLesson(1)}
                                    >
                                        Kursni boshlash
                                    </button>
                                </div>
                                <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1 }}>
                                    <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .lesson-card:hover {
                    transfrom: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <Footer />
        </div>
    );
};

export default Theory;
