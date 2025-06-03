package co.com.SPR.stepsdefinitions;

import co.com.SPR.tasks.EliminarPostulacion;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class EliminarPostulacionStepDefinitions {

    @Cuando("^Cuando el usuario oprima el campo de postularse debe oprimir el campo de eliminar postulacion$")
    public void cuandoElUsuarioOprimaElCampoDePostularseDebeOprimirElCampoDeEliminarPostulacion() {
        theActorInTheSpotlight().wasAbleTo(EliminarPostulacion.eliminarPostulacion());
    }


    @Cuando("^el usuario se encuentre postulado en un servicio$")
    public void elUsuarioSeEncuentrePostuladoEnUnServicio() {

    }

    @Entonces("^visualizara y dara click en un boton para eliminar su postulacion el sistema eliminara su postulacion con exito$")
    public void visualizaraYDaraClickEnUnBotonParaEliminarSuPostulacionElSistemaEliminaraSuPostulacionConExito() {
        ;
    }
}
