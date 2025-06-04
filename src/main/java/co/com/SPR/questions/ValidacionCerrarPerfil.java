package co.com.SPR.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;

public class ValidacionCerrarPerfil implements Question<Boolean> {
    public static ValidacionCerrarPerfil validacionCerrarPerfil() {return new ValidacionCerrarPerfil();}

    @Override
    public Boolean answeredBy(Actor actor){
        String currentUrl = BrowseTheWeb.as(actor).getDriver().getCurrentUrl();
        return currentUrl.contains("/");
    }
}
